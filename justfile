install clean="false":
    go mod {{ if clean == "true" { "download" } else { "tidy" } }}
    uv sync {{ if clean == "true" { "--locked" } else { "" } }}
    pnpm {{ if clean == "true" { "ci" } else { "i" } }}

lint:
    go run . .
    uv run poe lint
    pnpm lint

format:
    just --fmt
    gofmt -w .

test:
    go test ./rules/...
    pnpm -r test

coverage:
    go test -coverprofile=coverage.out ./rules/...
    pnpm -r coverage

documentation:
    rm -rf build/doc2go/
    doc2go -out build/doc2go/ ./rules/...
    uv run poe documentation
    pnpm documentation

prepare-website:
    uv pip install -r website/requirements.txt

publish-website: prepare-website documentation
    rm -rf website/docs/api/
    mkdir -p website/docs/api/
    mv build/doc2go/ website/docs/api/godoc/
    mv build/pdoc/ website/docs/api/pydoc/
    mv build/typedoc/ website/docs/api/tsdoc/
    cd website/ && uv run mkdocs gh-deploy
    rm -rf website/docs/api/

preview-website: prepare-website
    cd website/ && uv run mkdocs serve --livereload
