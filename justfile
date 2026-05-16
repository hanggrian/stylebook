prepare:
    mkdir -p stylebook-cli/build/
    cd stylebook-cli/build/ && cmake .. -G Ninja

build:
    cd stylebook-cli/build/ && cmake --build .

install-all clean="false":
    uv sync {{ if clean == "true" { "--locked" } else { "" } }}
    pnpm {{ if clean == "true" { "ci" } else { "i" } }}

lint: build
    stylebook-cli/build/stylebook sample/

lint-all: lint
    just --fmt --check
    uv run poe lint
    pnpm lint

test-all:
    pnpm -r test

coverage-all:
    pnpm -r coverage

documentation-all:
    uv run poe documentation
    pnpm documentation

prepare-website:
    uv pip install -r website/requirements.txt

publish-website: prepare-website documentation-all
    rm -rf website/docs/api/
    mkdir -p website/docs/api/
    mv build/pdoc/ website/docs/api/pydoc/
    mv build/typedoc/ website/docs/api/tsdoc/
    cd website/ && uv run mkdocs gh-deploy
    rm -rf website/docs/api/

preview-website: prepare-website
    cd website/ && uv run mkdocs serve --livereload
