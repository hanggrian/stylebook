[![GitHub Actions](https://shields.io/github/actions/workflow/status/hanggrian/stylebook/code-analysis.yaml)](https://github.com/hanggrian/stylebook/actions/workflows/code-analysis.yaml)
[![Codecov](https://shields.io/codecov/c/gh/hanggrian/stylebook)](https://app.codecov.io/gh/hanggrian/stylebook/)
[![Renovate](https://shields.io/badge/renovate-enabled-brightgreen)](https://developer.mend.io/github/hanggrian/stylebook/)\
[![GitHub Release](https://img.shields.io/github/release/hanggrian/stylebook)](https://pkg.go.dev/github.com/hanggrian/stylebook/)
[![PyPI](https://shields.io/pypi/v/stylebook)](https://pypi.org/project/stylebook/)
[![TestPyPI](https://shields.io/pypi/v/stylebook?label=testpypi&pypiBaseUrl=https://test.pypi.org)](https://test.pypi.org/project/stylebook/)
[![NPM](https://shields.io/npm/v/@hanggrian/stylebook)](https://npmjs.com/package/@hanggrian/stylebook/)\
[![Go](https://img.shields.io/github/go-mod/go-version/hanggrian/stylebook)](https://go.dev/doc/go1.26/)
[![Python](https://shields.io/badge/python-3.10+-informational)](https://docs.python.org/3.10/)
[![Node](https://shields.io/badge/node-12+-informational)](https://nodejs.org/en/blog/release/v12.0.0/)

# Stylebook

![The Stylebook logo.](https://github.com/hanggrian/stylebook/raw/assets/logo.svg)

Linter aggregator for various data formats. All rules are preconfigured with
common rules like duplicate blank lines, trailing whitespace and consistent
indentation. In Markdown, it has third-party rules to check dead links and
broken images.

<table>
  <thead>
    <tr>
      <th>Runner</th>
      <th>File type</th>
      <th>Linter</th>
      <th>Config file</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="10">Go</td>
      <td>CSV</td>
      <td>
        <a href="https://github.com/Clever/csvlint/">
          csvlint
        </a>
        with<br>
        <a href="https://www.rfc-editor.org/rfc/rfc4180.html">
          RFC 4180
        </a>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>Dockerfile</td>
      <td>
        <a href="https://github.com/hadolint/hadolint/">
          Hadolint
        </a>
        with<br>
        <a href="https://docs.docker.com/build/building/best-practices/">
          Docker Build Best Practices
        </a>
      </td>
      <td><code>.hadolint.yaml</code></td>
    </tr>
    <tr>
      <td>Go Module</td>
      <td>
        <a href="https://github.com/ldez/gomoddirectives/">
          gomoddirectives
        </a>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>LaTeX</td>
      <td>
        <a href="https://cgit.git.savannah.nongnu.org/cgit/chktex.git">
          ChkTeX
        </a>
      </td>
      <td><code>.chktexrc</code></td>
    </tr>
    <tr>
      <td>Makefile</td>
      <td>
        <a href="https://github.com/checkmake/checkmake/">
          checkmake
        </a>
      </td>
      <td><code>.checkmake.ini</code></td>
    </tr>
    <tr>
      <td>Properties</td>
      <td>
        <a href="https://github.com/hanggrian/propertieslint/">
          propertieslint
        </a>
      </td>
      <td><code>.propertieslint.json</code></td>
    </tr>
    <tr>
      <td>Protobuf</td>
      <td>
        <a href="https://github.com/yoheimuta/protolint/">
          protolint
        </a>
        with<br>
        <a href="https://protobuf.dev/programming-guides/style/">
          Protobuf Style Guide
        </a>
      </td>
      <td><code>.buf.yaml</code></td>
    </tr>
    <tr>
      <td>Shell</td>
      <td>
        <a href="https://github.com/koalaman/shellcheck/">
          ShellCheck
        </a>
      </td>
      <td><code>.shellcheckrc</code></td>
    </tr>
    <tr>
      <td>Terraform</td>
      <td>
        <a href="https://github.com/terraform-linters/tflint/">
          TFLint
        </a>
        with<br>
        <a href="https://developer.hashicorp.com/terraform/language/style/">
          Terraform Style Guide
        </a>
      </td>
      <td><code>.tflint.hcl</code></td>
    </tr>
    <tr>
      <td>XML</td>
      <td>
        <a href="https://github.com/GNOME/libxml2/tree/master/">
          libxml2
        </a>
      </td>
      <td></td>
    </tr>
    <tr>
      <td rowspan="7">Python</td>
      <td>Batch</td>
      <td>
        <a href="https://github.com/tboy1337/Blinter/">
          Blinter
        </a>
      </td>
      <td><code>blinter.ini</code></td>
    </tr>
    <tr>
      <td>Dotenv</td>
      <td>
        <a href="https://github.com/wemake-services/dotenv-linter/">
          dotenv-linter
        </a>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>INI</td>
      <td>
        <a href="https://gitlab.com/danieljrmay/pyinilint/">
          PyINILint
        </a>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>SQL</td>
      <td>
        <a href="https://github.com/sqlfluff/sqlfluff/">
          SQLFluff
        </a>
        with<br>
        <a href="https://docs.telemetry.mozilla.org/concepts/sql_style/">
          Mozilla SQL Style Guide
        </a>
      </td>
      <td><code>.sqlfluff</code></td>
    </tr>
    <tr>
      <td>TOML</td>
      <td>
        <a href="https://github.com/tamasfe/taplo/">
          Taplo
        </a>
        with<br>
        <a href="https://toml.io/en/">
          TOML Quick Tour
        </a>
      </td>
      <td><code>.taplo.toml</code></td>
    </tr>
    <tr>
      <td>YAML</td>
      <td>
        <a href="https://github.com/adrienverge/yamllint/">
          yamllint
        </a>
        with<br>
        <a href="https://www.yaml.info/learn/bestpractices.html">
          YAML Best Practices
        </a>
      </td>
      <td><code>.yamllintrc.yaml</code></td>
    </tr>
    <tr>
      <td>reStructuredText</td>
      <td>
        <a href="https://github.com/twolfson/restructuredtext-lint/">
          restructuredtext-lint
        </a>
      </td>
      <td></td>
    </tr>
    <tr>
      <td rowspan="6">Node</td>
      <td>CSS</td>
      <td>
        <a href="https://github.com/stylelint/stylelint/">
          Stylelint
        </a>
        with<br>
        <a href="https://protocol.mozilla.org/docs/contributing/css-guide/">
          Mozilla CSS Coding Guide
        </a>
      </td>
      <td>
        <a href="https://stylelint.io/user-guide/configure/">
          Stylelint Configuration
        </a>
      </td>
    </tr>
    <tr>
      <td>HTML</td>
      <td>
        <a href="https://github.com/htmlhint/HTMLHint/">
          HTMLHint
        </a>
        with<br>
        <a href="https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide/HTML/">
          Mozilla HTML Style Guide
        </a>
      </td>
      <td><code>.htmlhintrc</code></td>
    </tr>
    <tr>
      <td>JSON</td>
      <td>
        <a href="https://github.com/prantlf/jsonlint/">
          JSON Lint
        </a>
      </td>
      <td><code>.jsonlintrc.json</code></td>
    </tr>
    <tr>
      <td>Lockfile</td>
      <td>
        <a href="https://github.com/lirantal/lockfile-lint/">
          lockfile-lint
        </a>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>Markdown</td>
      <td>
        <a href="https://github.com/davidanson/markdownlint/">
          markdownlint
        </a>
        with<br>
        <a href="https://experienceleague.adobe.com/en/docs/contributor/contributor-guide/writing-essentials/markdown/">
          Adobe Markdown Basics
        </a>
      </td>
      <td><code>.markdownlint.json</code></td>
    </tr>
    <tr>
      <td>Mermaid</td>
      <td>
        <a href="https://github.com/probelabs/maid/">
          Maid
        </a>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>

[View all rules](https://hanggrian.github.io/stylebook/rules/)

## Download

Several linters must be installed separatedly, preferably at OS level:

- ChkTeX
- Hadolint
- ShellCheck
- libxml2

### Go

Most linters are brought in as dependencies, but others need to be installed to
get the binaries.

```sh
go install github.com/hanggrian/stylebook@latest
go install github.com/checkmake/checkmake/cmd/checkmake@latest
go install github.com/terraform-linters/tflint@latest
```

### PyPI

PyPI transitively brings linter dependencies.

```sh
pip install stylebook
```

### NPM

Most linters are brought in as dependencies, except for Stylelint, which needs
to be installed in the root `package.json`.

```sh
npm i @hanggrian/stylebook \
  stylelint @stylistic/stylelint-plugin stylelint-config-recommended --save-dev
```

## Usage

<img
  width="480px"
  alt="CLI screenshot"
  src="https://github.com/hanggrian/stylebook/raw/assets/screenshot.png">

Insert target paths into the command. The program will recursively search for
qualifying file types and spawn the corresponding linter processes.

```sh
stylebook . # Go binary
npx @hanggrian/stylebook some-folder/ some-file.sql
source .venv/bin/activate && stylebook **/*
```

### Configuration

Configuration files are automatically picked up. If the file doesn't exist, the
program will use default configuration. If `.stylebookrc` exists in the root
project directory, it will be used as exclusion list.
