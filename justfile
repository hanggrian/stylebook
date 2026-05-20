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
    pnpm -r test

coverage:
    pnpm -r coverage

documentation:
    uv run poe documentation
    pnpm documentation

prepare-website:
    uv pip install -r website/requirements.txt

publish-website: prepare-website documentation
    rm -rf website/docs/api/
    mkdir -p website/docs/api/
    mv build/pdoc/ website/docs/api/pydoc/
    mv build/typedoc/ website/docs/api/tsdoc/
    cd website/ && uv run mkdocs gh-deploy
    rm -rf website/docs/api/

preview-website: prepare-website
    cd website/ && uv run mkdocs serve --livereload
