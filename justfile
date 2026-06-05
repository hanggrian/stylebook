install CLEAN="false":
    make install CLEAN={{ if CLEAN == "true" { "true" } else { "false" } }}
    uv sync {{ if CLEAN == "true" { "--locked" } else { "" } }}
    pnpm install {{ if CLEAN == "true" { "--frozen-lockfile" } else { "" } }}

[private]
lint1:
    make lint

[private]
lint2:
    uv run poe lint

[private]
lint3:
    pnpm lint

[group('check')]
[parallel]
lint: lint1 lint2 lint3

# skip markdownlint since it has network calls
[group('check')]
[parallel]
offline-lint: lint1 lint2
    pnpm -r lint
    pnpm stylebook . -d=markdownlint

[private]
test1:
    make test

[private]
test2:
    pnpm -r test

[group('check')]
[parallel]
test: test1 test2

[private]
cov1:
    make cov

[private]
cov2:
    pnpm -r cov

[parallel]
[private]
cov: cov1 cov2

format:
    just --fmt
    make format

[private]
doc1:
    make doc

[private]
doc2:
    uv run poe doc

[private]
doc3:
    pnpm doc

[parallel]
doc: doc1 doc2 doc3

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
