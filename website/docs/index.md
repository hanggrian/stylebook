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

    [PyPI](https://pypi.org/project/stylebook/){ .md-button .md-button--primary }&emsp;
    [NPM](https://pypi.org/project/@hanggrian/stylebook/){ .md-button }
