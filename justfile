install CLEAN="false":
    go mod {{ if CLEAN == "true" { "download" } else { "tidy" } }}
    uv sync {{ if CLEAN == "true" { "--locked" } else { "" } }}
    pnpm install {{ if CLEAN == "true" { "--frozen-lockfile" } else { "" } }}

[group('check')]
lint-go:
    go run . .

[group('check')]
lint-python:
    uv run poe lint

[group('check')]
lint-node:
    pnpm lint

[group('check')]
[parallel]
lint: lint-go lint-python lint-node

# skip lint-node with network calls
[group('check')]
[parallel]
minimal-lint: lint-go lint-python

[group('check')]
test-go:
    go test ./rules/...

[group('check')]
test-node:
    pnpm -r test

[group('check')]
[parallel]
test: test-go test-node

[group('check')]
cov-go:
    go test -coverprofile=coverage.out ./rules/...

[group('check')]
cov-node:
    pnpm -r cov

[group('check')]
[parallel]
cov: cov-go cov-node

format:
    just --fmt
    go fmt ./...

[group('doc')]
doc-python:
    uv run poe doc

[group('doc')]
doc-node:
    pnpm doc

[group('doc')]
[parallel]
doc: doc-python doc-node
    rm -rf build/doc2go/
    doc2go -out build/doc2go/ ./rules/...

[group('website')]
prepare-website:
    uv pip install -r website/requirements.txt

[group('website')]
preview-website: prepare-website
    cd website/ && uv run mkdocs serve --livereload

[group('website')]
publish-website: prepare-website doc
    mkdir -p website/docs/api/
    mv build/doc2go/ website/docs/api/godoc/
    mv build/pdoc/ website/docs/api/pydoc/
    mv build/typedoc/ website/docs/api/tsdoc/
    cd website/ && uv run mkdocs gh-deploy
    rm -rf website/docs/api/
