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

## Download

Get the artifacts from official package managers.

!!! download "Download the library"

    [PyPI](https://pypi.org/project/stylebook-data/){ .md-button .md-button--primary }&emsp;
    [NPM](https://pypi.org/project/stylebook-markup/){ .md-button }

## Integration

The main linter libraries can be downloaded using package managers. Preferrably,
use IDE plugins to instantly see the issues while coding.

!!! integration "Integrate the linter tools"

    <div class="grid cards" markdown>

    - **SQLFluff**

        ---

        A modular SQL linter and auto-formatter with support for multiple
        dialects and templated code.

        [PyPI :material-open-in-new:](https://pypi.org/project/sqlfluff/)
    - **Taplo**

        ---

        A TOML toolkit written in Rust.

        [PyPI :material-open-in-new:](https://pypi.org/project/taplo/)
    - **yamllint**

        ---

        A linter for YAML files.

        [PyPI :material-open-in-new:](https://pypi.org/project/yamllint/)
    - **Stylelint**

        ---

        A mighty CSS linter that helps you avoid errors and enforce conventions.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/stylelint/)
    - **HTMLHint**

        ---

        The static code analysis tool you need for your HTML

        [NPM :material-open-in-new:](https://www.npmjs.com/package/htmlhint/)
    - **JSON Lint**

        ---

        JSON/CJSON/JSON5 parser, syntax & schema validator and pretty-printer
        with a command-line client, written in pure JavaScript.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/@prantlf/jsonlint)
    - **markdownlint-cli2**

        ---

        A fast, flexible, configuration-based command-line interface for linting
        Markdown/CommonMark files with the markdownlint library.

        [NPM :material-open-in-new:](https://www.npmjs.com/package/markdownlint-cli2/)
    </div>
