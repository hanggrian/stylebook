[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/hanggrian/stylebook/code-analysis.yaml)](https://github.com/hanggrian/stylebook/actions/workflows/code-analysis.yaml)
[![Codecov](https://img.shields.io/codecov/c/gh/hanggrian/stylebook)](https://app.codecov.io/gh/hanggrian/stylebook/)
[![Renovate](https://img.shields.io/badge/dependency-mend-blue)](https://developer.mend.io/github/hanggrian/stylebook/)\
[![PyPI](https://shields.io/pypi/v/stylebook)](https://pypi.org/project/stylebook/)
[![TestPyPI](https://shields.io/pypi/v/stylebook?label=testpypi&pypiBaseUrl=https://test.pypi.org)](https://test.pypi.org/project/stylebook/)
[![Python](https://img.shields.io/badge/python-3.10+-informational)](https://docs.python.org/3.10/)\
[![NPM](https://shields.io/npm/v/@hanggrian/stylebook)](https://www.npmjs.com/package/@hanggrian/stylebook/)
[![Node](https://img.shields.io/badge/node-12+-informational)](https://nodejs.org/en/blog/release/v12.0.0/)

# Stylebook

![The Stylebook logo.](https://github.com/hanggrian/stylebook/raw/assets/logo.svg)

Third-party linter rules and configuration for various data formats not
considered as a programming language.

<table>
  <thead>
    <tr>
      <th>Runner</th>
      <th>File type</th>
      <th>Linter</th>
      <th>Style</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">Python</td>
      <td>SQL</td>
      <td>
        <a href="https://github.com/sqlfluff/sqlfluff/">
          SQLFluff
        </a>
      </td>
      <td>
        <a href="https://docs.telemetry.mozilla.org/concepts/sql_style/">
          Mozilla SQL Style Guide
        </a>
      </td>
    </tr>
    <tr>
      <td>TOML</td>
      <td>
        <a href="https://github.com/tamasfe/taplo/">
          Taplo
        </a>
      </td>
      <td>
        <a href="https://toml.io/en/">
          TOML Spec
        </a>
      </td>
    </tr>
    <tr>
      <td>YAML</td>
      <td>
        <a href="https://github.com/adrienverge/yamllint/">
          yamllint
        </a>
      </td>
      <td>
        <a href="https://developers.home-assistant.io/docs/documenting/yaml-style-guide/">
          Home Assistant YAML Style Guide
        </a>
      </td>
    </tr>
    <tr>
      <td rowspan="4">Node</td>
      <td>CSS</td>
      <td>
        <a href="https://github.com/stylelint/stylelint/">
          Stylelint
        </a>
      </td>
      <td>
        <a href="https://protocol.mozilla.org/docs/contributing/css-guide/">
          Mozilla HTML Coding Guide
        </a>
      </td>
    </tr>
    <tr>
      <td>HTML</td>
      <td>
        <a href="https://github.com/htmlhint/HTMLHint/">
          HTMLHint
        </a>
      </td>
      <td>
        <a href="https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide/HTML/">
          Mozilla HTML Style Guide
        </a>
      </td>
    </tr>
    <tr>
      <td>JSON</td>
      <td>
        <a href="https://github.com/prantlf/jsonlint/">
          JSON Lint
        </a>
      </td>
      <td>
        <a href="https://spec.json5.org/">
          JSON5 Spec
        </a>
      </td>
    </tr>
    <tr>
      <td>Markdown</td>
      <td>
        <a href="https://github.com/davidanson/markdownlint/">
          markdownlint
        </a>
      </td>
      <td>
        <a href="https://github.github.com/gfm/">
          GitHub Flavored Markdown Spec
        </a>
      </td>
    </tr>
  </tbody>
</table>

## Download

PyPI transitively brings linter dependencies. In NPM, dependencies can be
selectively imported.

### PyPI

```sh
pip install stylebook
```

### NPM

```sh
npm i @hanggrian/stylebook \
  stylelint @stylistic/stylelint-plugin stylelint-config-recommended \
  htmlhint \
  @prantlf/jsonlint \
  markdownlint markdownlint-cli2 --save-dev
```

## Usage

<img
  width="480px"
  alt="CLI screenshot"
  src="https://github.com/hanggrian/stylebook/raw/assets/screenshot.png">

Insert target paths into the command. The program will recursively search for
qualifying file types and spawn the corresponding linter processes.

```sh
npx @hanggrian/stylebook some-folder/ some-file.sql
source .venv/bin/activate && stylebook **/*
```

### Configuration

Configuration files are automatically picked up. If the file doesn't exist, the
program will use default configuration.

- **SQLFluff:** `.sqlfluff`
- **tomllint:** `.taplo.toml`
- **yamllint:** `.yamllintrc.json`
- **Stylelint:** `.stylint.config.js`
- **HTMLHint:** `.htmlhintrc`
- **JSON Lint:** `.jsonlintrc.config.json`
- **markdownlint:** `.markdownlint-cli2.json`
