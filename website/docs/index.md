---
hide:
  - navigation
---

!!! features1 "What is Stylebook?"

    <div class="grid cards" markdown>

    - <div style="text-align: center">
        :material-puzzle:{ .xxxl #primary }<br>
        <b id="primary">Library extension</b><br>
        A set of additional rules for static code analysis tools
      </div>
    - <div style="text-align: center">
        :material-console:{ .xxxl #primary }<br>
        <b id="primary">Simplified CLI</b><br>
        One command to lint multiple file types
      </div>
    </div>

!!! features2 "How does it work?"

    ```mermaid
    flowchart LR
      subgraph "Project"
        src(Source code)
        config1[Optional config files]
      end
      subgraph "Static analysis"
        linters[Linter libraries]
        extensions[Rule extensions]
        config2[Default config files]
      end
      subgraph "Report"
        cli[Build failure<br>on lint errors]
      end
      subgraph "Refactor"
        manual(Manual edits<br>using suggestions)
      end

      src -- run --> linters
      extensions -- CLI --> cli
      cli -- fix --> manual
    ```

## Support list

Many thanks to the communities who maintain the linter tools!

!!! integration "One CLI to rule them all"

    <div class="grid cards" markdown>

    - :material-microsoft-windows:{ .xl .middle } **Blinter**

        ---

        Blinter is a linter for Windows batch files.

        [PyPI :material-open-in-new:](https://pypi.org/project/Blinter/)
    - :simple-make:{ .xl .middle } **checkmake**

        ---

        Linter/analyzer for Makefiles.
    - :simple-latex:{ .xl .middle } **ChkTeX**

        ---

        LaTeX semantic checker.

        [Website :material-open-in-new:](https://www.nongnu.org/chktex/)
    - :simple-css:{ .xl .middle } **Stylelint**

        ---

         A mighty CSS linter that helps you avoid errors and enforce
         conventions.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/stylelint/)&emsp;
        [Website :material-open-in-new:](https://stylelint.io/)
    - :material-file-delimited-outline:{ .xl .middle } **csvlint**

        ---

        Library and command line tool that validates a CSV file.
    - :simple-dotenv:{ .xl .middle } **dotenv-linter**

        ---

        ☺️ Linting dotenv files like a charm!

        [PyPI :material-open-in-new:](https://pypi.org/project/dotenv-linter/)&emsp;
        [Website :material-open-in-new:](https://dotenv-linter.readthedocs.io/en/latest/)
    - :material-package-variant:{ .xl .middle } **gomoddirectives**

        ---

        A linter that handle directives into `go.mod`.
    - :simple-docker:{ .xl .middle } **hadolint**

        ---

        Dockerfile linter, validate inline bash, written in Haskell.
    - :simple-html5:{ .xl .middle } **HTMLHint**

        ---

        ⚙️ The static code analysis tool you need for your HTML.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/htmlhint/)&emsp;
        [Website :material-open-in-new:](https://htmlhint.com/)
    - :simple-json:{ .xl .middle } **JSON Lint**

        ---

        JSON/CJSON/JSON5 parser, syntax & schema validator and pretty-printer
        with a command-line client, written in pure JavaScript.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/@prantlf/jsonlint/)&emsp;
        [Website :material-open-in-new:](http://prantlf.github.io/jsonlint/)
    - :material-lock-outline:{ .xl .middle } **lockfile-lint**

        ---

        Lint an npm or yarn lockfile to analyze and detect security issues.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/lockfile-lint/)
    - :simple-xml:{ .xl .middle } **libxml2**

        ---

        A Pluggable Terraform Linter.
    - :simple-mermaid:{ .xl .middle } **Maid**

        ---

        A lightweight Mermaid diagram linter which helps humans and AI with
        perfect diagrams.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/@probelabs/maid/)&emsp;
        [Website :material-open-in-new:](https://probelabs.com/maid/)
    - :simple-markdown:{ .xl .middle } **markdownlint**

        ---

        A Node.js style checker and lint tool for Markdown/CommonMark files.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/markdownlint/)
    - :material-cog-outline:{ .xl .middle } **propertieslint**

        ---

        A linter for `.properties` file.
    - :material-code-tags:{ .xl .middle } **protolint**

        ---

        A pluggable linter and fixer to enforce Protocol Buffer style and
        conventions.
    - :simple-toml:{ .xl .middle } **py-taplo**

        ---

        Python wrapper for taplo TOML toolkit.

        [PyPI :material-open-in-new:](https://pypi.org/project/py-taplo/)&emsp;
        [Website :material-open-in-new:](https://taplo.tamasfe.dev/)
    - :material-cog-outline:{ .xl .middle } **pyinilint**

        ---

        A linter for INI-like configuration files which are intended to be
        parsed by the standard Python configparser module.

        [PyPI :material-open-in-new:](https://pypi.org/project/pyinilint/)
    - :simple-gnubash:{ .xl .middle } **ShellCheck**

        ---

        ShellCheck, a static analysis tool for shell scripts.

        [Website :material-open-in-new:](https://www.shellcheck.net/)
    - :material-database-outline:{ .xl .middle } **SQLFluff**

        ---

        A modular SQL linter and auto-formatter with support for multiple dialects and templated code.

        [PyPI :material-open-in-new:](https://pypi.org/project/sqlfluff/)&emsp;
        [Website :material-open-in-new:](https://taplo.tamasfe.dev/)
    - :simple-terraform:{ .xl .middle } **TFLint**

        ---

        A Pluggable Terraform Linter.
    - :simple-yaml:{ .xl .middle } **yamllint**

        ---

        A linter for YAML files.

        [PyPI :material-open-in-new:](https://pypi.org/project/yamllint/)
    </div>

## Download

Get the artifacts from official package managers.

!!! download "Download the library"

    [PyPI](https://pypi.org/project/stylebook/){ .md-button .md-button--primary }&emsp;
    [NPM](https://npmjs.com/package/@hanggrian/stylebook/){ .md-button }
