distro := if os() == "linux" { `grep -Po '(?<=^ID=).+' /etc/os-release | tr -d '"'` } else { os() }

install clean="false":
    just _task-{{ distro }} install
    uv sync {{ if clean == "true" { "--locked" } else { "" } }}
    pnpm {{ if clean == "true" { "ci" } else { "i" } }}

lint:
    just _task-{{ distro }} lint
    uv run poe lint
    pnpm lint

format:
    just --fmt
    just _task-{{ distro }} format

test:
    just _task-{{ distro }} test
    pnpm -r test

coverage:
    just _task-{{ distro }} coverage
    pnpm -r coverage

documentation:
    just _task-{{ distro }} documentation
    uv run poe documentation
    pnpm documentation

prepare-website:
    uv pip install -r website/requirements.txt

preview-website: prepare-website
    cd website/ && uv run mkdocs serve --livereload

publish-website: prepare-website documentation
    rm -rf website/docs/api/
    mkdir -p website/docs/api/
    mv build/doc2go/ website/docs/api/godoc/
    mv build/pdoc/ website/docs/api/pydoc/
    mv build/typedoc/ website/docs/api/tsdoc/
    cd website/ && uv run mkdocs gh-deploy
    rm -rf website/docs/api/

_task-arch *args:
    go-task {{ args }}

_task-fedora *args:
    go-task {{ args }}

_task-ubuntu *args:
    task {{ args }}

_task-macos *args:
    task {{ args }}

_task-windows *args:
    task {{ args }}
