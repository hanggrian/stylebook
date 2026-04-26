[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/hanggrian/stylebook/code-analysis.yaml)](https://github.com/hanggrian/stylebook/actions/workflows/code-analysis.yaml)
[![Codecov](https://img.shields.io/codecov/c/gh/hanggrian/stylebook)](https://app.codecov.io/gh/hanggrian/stylebook/)
[![Renovate](https://img.shields.io/badge/dependency-mend-blue)](https://developer.mend.io/github/hanggrian/stylebook/)
[![Node](https://img.shields.io/badge/node-12+-informational)](https://nodejs.org/en/blog/release/v12.0.0/)

# Stylebook

Third-party linter rules and configuration for various data formats not
considered as a programming language.

<table>
  <thead>
    <tr>
      <th>CLI</th>
      <th>File type</th>
      <th>Linter</th>
      <th>Style</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3"><code>stylebook-data</code></td>
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
        <a href="https://yaml.org/spec/">
          YAML Spec
        </a>
      </td>
    </tr>
    <tr>
      <td rowspan="4"><code>stylebook-markup</code></td>
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

### PyPI

```sh
pip install stylebook-data
```

### NPM

```sh
npm install stylebook-markup \
  stylelint @stylistic/stylelint-plugin stylelint-config-recommended \
  @prantlf/jsonlint \
  markdownlint markdownlint-cli2 --save-dev
```

## Usage

### SQLFluff

No setup is necessary. However, to customize behaviors, a local
`.sqlfluff` is needed.

### tomllint

No setup is necessary. However, to customize behaviors, a local
`.taplo.toml` is needed.

### yamllint

No setup is necessary. However, to customize behaviors, a local
`.yamllintrc.json` is needed.

### Stylelint

Create `.stylint.config.js` file in the root directory.

### HTML Hint

No setup is necessary. However, to customize behaviors, a local
`.htmlhintrc` is needed.

### JSON Lint

No setup is necessary. However, to customize behaviors, a local
`.jsonlintrc.config.json` is needed.

### markdownlint

No setup is necessary. However, to customize behaviors, a local
`.markdownlint-cli2.json` is needed.
