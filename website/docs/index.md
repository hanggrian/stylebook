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

Extended linters have extra custom rules. Linters with API prints unified output
message while messages printed by binary calls cannot be modified.

| Markup documents | Linter | Identifiers | Config file | Extended | API |
| --- | --- | --- | --- | :---: | :---: |
| :simple-asciidoctor:{ .xl .middle }&ensp;AsciiDoc | AsciiDoc-Linter<br>[Website :material-open-in-new:](https://doctoolchain.org/asciidoc-linter/) | <ul><li><code>*.{adoc,asciidoc}</code></li></ul> | | | :material-check:{ .lg } |
| :simple-css:{ .xl .middle }&ensp;CSS | Stylelint<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/stylelint/)&ensp;[Website :material-open-in-new:](https://stylelint.io/) | <ul><li><code>*.css</code></li></ul> | [Stylelint configuration](https://stylelint.io/user-guide/configure/) | | :material-check:{ .lg } |
| :simple-latex:{ .xl .middle }&ensp;LaTeX | ChkTeX<br>[Website :material-open-in-new:](https://ctan.org/pkg/chktex/) | <ul><li><code>*.tex</code></li></ul> | `.chktexrc` | | |
| :simple-html5:{ .xl .middle }&ensp;HTML | HTMLHint<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/htmlhint/)&ensp;[Website :material-open-in-new:](https://htmlhint.com/) | <ul><li><code>*.{html,htm}</code></li></ul> | `.htmlhintrc` | :material-check:{ .lg } | :material-check:{ .lg } |
| :simple-markdown:{ .xl .middle }&ensp;Markdown | markdownlint<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/markdownlint/) | <ul><li><code>*.{md,markdown}</code></li></ul> | `.markdownlint.json` | :material-check:{ .lg } | :material-check:{ .lg } |
| :material-format-title:{ .xl .middle }&ensp;reStructuredText | restructuredtext-lint<br>[PyPI :material-open-in-new:](https://pypi.org/project/restructuredtext-lint/) | <ul><li><code>*.{rst,rest}</code></li></ul> | | | :material-check:{ .lg } |
| **Serialization formats** | **Linter** | **Identifiers** | **Config file** | **Extended** | **API** |
| :material-code-braces:{ .xl .middle }&ensp;Amazon State Language | asl-validator<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/asl-validator) | <ul><li><code>*.asl.{json,yaml,yml}</code></li></ul> | | | :material-check:{ .lg } |
| :material-file-delimited-outline:{ .xl .middle }&ensp;CSV | csvlint<br>[pkgsite :material-open-in-new:](https://pkg.go.dev/github.com/Clever/csvlint/) | <ul><li><code>*.{csv,tsv}</code></li></ul> | | | :material-check:{ .lg } |
| :simple-json:{ .xl .middle }&ensp;JSON | JSON Lint<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/@prantlf/jsonlint/)&ensp;[Website :material-open-in-new:](http://prantlf.github.io/jsonlint/) | <ul><li><code>*.{json,jsonc,cjson,json5}</code></li></ul> | `.jsonlintrc.json` | | :material-check:{ .lg } |
| :material-code-tags:{ .xl .middle }&ensp;Protobuf | protolint<br>[pkgsite :material-open-in-new:](https://pkg.go.dev/github.com/yoheimuta/protolint/) | <ul><li><code>*.proto</code></li></ul> | `.buf.yaml` | :material-check:{ .lg } | :material-check:{ .lg } |
| :simple-toml:{ .xl .middle }&ensp;TOML | py-taplo<br>[PyPI :material-open-in-new:](https://pypi.org/project/py-taplo/)&ensp;[Website :material-open-in-new:](https://taplo.tamasfe.dev/) | <ul><li><code>*.toml</code></li></ul> | `.taplo.toml` | | |
| :simple-yaml:{ .xl .middle }&ensp;YAML | yamllint<br>[PyPI :material-open-in-new:](https://pypi.org/project/yamllint/) | <ul><li><code>*.{yaml,yml}</code></li></ul> | `.yamllintrc.yaml` | | :material-check:{ .lg } |
| :simple-xml:{ .xl .middle }&ensp;XML | libxml2 | <ul><li><code>*.{xml,xhtml,xsl,svg,xaml}</code></li></ul> | | | |
| **Query languages** | **Linter** | **Identifiers** | **Config file** | **Extended** | **API** |
| :simple-graphql:{ .xl .middle }&ensp;GraphQL | graphql-schema-linter<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/graphql-schema-linter/) | <ul><li><code>*.{gql,graphql,gqls,graphqls}</code></li></ul> | `.graphql-schema-linterrc` | | :material-check:{ .lg } |
| :material-database-outline:{ .xl .middle }&ensp;SQL | SQLFluff<br>[PyPI :material-open-in-new:](https://pypi.org/project/sqlfluff/)&ensp;[Website :material-open-in-new:](https://www.sqlfluff.com/) | <ul><li><code>*.sql</code></li></ul> | `.sqlfluff` | | :material-check:{ .lg } |
| **Scripting languages** | **Linter** | **Identifiers** | **Config file** | **Extended** | **API** |
| :material-microsoft-windows:{ .xl .middle }&ensp;Batch | Blinter<br>[PyPI :material-open-in-new:](https://pypi.org/project/Blinter/) | <ul><li><code>*.{bat,btm,cmd}</code></li></ul> | `blinter.ini` | | |
| :simple-gnubash:{ .xl .middle }&ensp;Shell | ShellCheck<br>[Website :material-open-in-new:](https://www.shellcheck.net/) | <ul><li><code>*.{sh,bash}</code></li></ul> | `.shellcheckrc` | | |
| **Key-value pairs** | **Linter** | **Identifiers** | **Config file** | **Extended** | **API** |
| :simple-dotenv:{ .xl .middle }&ensp;Dotenv | dotenv-linter<br>[PyPI :material-open-in-new:](https://pypi.org/project/dotenv-linter/)&ensp;[Website :material-open-in-new:](https://dotenv-linter.readthedocs.io/en/latest/) | <ul><li><code>*.{env,dotenv}</code></li></ul> | | | |
| :material-cog-outline:{ .xl .middle }&ensp;INI | pyinilint<br>[PyPI :material-open-in-new:](https://pypi.org/project/pyinilint/) | <ul><li><code>*.ini</code></li></ul> | | | |
| :material-cog:{ .xl .middle }&ensp;Properties | propertieslint<br>[pkgsite :material-open-in-new:](https://pkg.go.dev/github.com/hanggrian/propertieslint/)&ensp;[Website :material-open-in-new:](https://hanggrian.github.io/propertieslint/) | <ul><li><code>*.properties</code></li></ul> | `.propertieslint.json` | | :material-check:{ .lg } |
| **Configuration files** | **Linter** | **Identifiers** | **Config file** | **Extended** | **API** |
| :simple-ansible:{ .xl .middle }&ensp;Ansible | Ansible Lint<br>[PyPI :material-open-in-new:](https://pypi.org/project/ansible-lint/)&ensp;[Website :material-open-in-new:](https://docs.ansible.com/projects/lint/) | <ul><li><code>site.{yaml,yml}</code></li><li><code>webservers.{yaml,yml}</code></li><li><code>dbservers.{yaml,yml}</code></li><li><code>group_vars/\*\*/\*.{yaml,yml}</code></li><li><code>host_vars/\*\*/\*.{yaml,yml}</code></li><li><code>roles/\*\*/\*.{yaml,yml}</code></li><li><code>tasks/\*\*/\*.{yaml,yml}</code></li></ul> | | | :material-check:{ .lg } |
| :material-google-cloud:{ .xl .middle }&ensp;AWS CloudFormation | CloudFormation Linter<br>[PyPI :material-open-in-new:](https://pypi.org/project/cfn-lint/) | <ul><li><code>cloudformation/\*\*/\*.{yaml,yml}</code></li><li><code>cfn/\*\*/\*.{yaml,yml}</code></li><li><code>infrastructure/\*\*/\*.{yaml,yml}</code></li><li><code>infra/\*\*/\*.{yaml,yml}</code></li></ul> | `.cfnlintrc.yaml` | | :material-check:{ .lg } |
| :simple-docker:{ .xl .middle }&ensp;Dockerfile | hadolint | <ul><li><code>Dockerfile</code></li><li><code>Containerfile</code></li><li><code>Dockerfile.\*</code></li><li><code>Containerfile.\*</code></li></ul> | `.hadolint.yaml` | | |
| :simple-github:{ .xl .middle }&ensp;GitHub Actions | actionlint<br>[pkgsite :material-open-in-new:](https://pkg.go.dev/github.com/rhysd/actionlint/)&ensp;[Website :material-open-in-new:](https://rhysd.github.io/actionlint/) | <ul><li><code>.github/workflows/*.{yaml,yml}</code></li></ul> | | | :material-check:{ .lg } |
| :simple-kubernetes:{ .xl .middle }&ensp;Kubernetes | KubeLinter<br>[pkgsite :material-open-in-new:](https://pkg.go.dev/github.com/stackrox/kube-linter/)&ensp;[Website :material-open-in-new:](https://docs.kubelinter.io/) | <ul><li><code>manifests/*.{yaml,yml}</code></li></ul> | `.kubelinter-config.yaml` | | :material-check:{ .lg } |
| :simple-make:{ .xl .middle }&ensp;Makefile | checkmake<br>[pkgsite :material-open-in-new:](https://pkg.go.dev/github.com/checkmake/checkmake/) | <ul><li><code>Makefile</code></li><li><code>makefile</code></li><li><code>GNUmakefile</code></li></ul> | `.checkmake.ini` | | :material-check:{ .lg } |
| :simple-tekton:{ .xl .middle }&ensp;Tekton | tekton-lint<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/@ibm/tekton-lint/) | <ul><li><code>.tekton/*.{yaml,yml}</code></li></ul> | `.tektonlintrc.yaml` | | :material-check:{ .lg } |
| :simple-terraform:{ .xl .middle }&ensp;Terraform | TFLint<br>[pkgsite :material-open-in-new:](https://pkg.go.dev/github.com/terraform-linters/tflint/) | <ul><li><code>*.tf</code></li></ul> | `.tflint.hcl` | | |
| **Diagram tools** | **Linter** | **Identifiers** | **Config file** | **Extended** | **API** |
| :simple-mermaid:{ .xl .middle }&ensp;Mermaid | mermaid-lint<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/mermaid-lint/)&ensp;[Website :material-open-in-new:](https://probelabs.com/maid/) | <ul><li><code>*.{mmd,mermaid}</code></li></ul> | | | :material-check:{ .lg } |
| **Build tools** | **Linter** | **Identifiers** | **Config file** | **Extended** | **API** |
| :material-package-variant:{ .xl .middle }&ensp;Go modules | gomoddirectives<br>[pkgsite :material-open-in-new:](https://pkg.go.dev/github.com/ldez/gomoddirectives/) | <ul><li><code>go.mod</code></li></ul> | | | :material-check:{ .lg } |
| :material-lock-outline:{ .xl .middle }&ensp;Lockfile | lockfile-lint<br>[NPM :material-open-in-new:](https://www.npmjs.com/package/lockfile-lint/) | <ul><li><code>package-lock.json</code></li><li><code>npm-shrinkwrap.json</code></li><li><code>yarn.lock</code></li></ul> | | | :material-check:{ .lg } |

## Download

Get the artifacts from official package managers.

!!! download "Download the library"

    [PyPI](https://pypi.org/project/stylebook/){ .md-button .md-button--primary }&emsp;
    [NPM](https://npmjs.com/package/@hanggrian/stylebook/){ .md-button }
