[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/hanggrian/stylebook/code-analysis.yml)](https://github.com/hanggrian/stylebook/actions/workflows/code-analysis.yml)
[![Codecov](https://img.shields.io/codecov/c/gh/hanggrian/stylebook)](https://app.codecov.io/gh/hanggrian/stylebook/)
[![Renovate](https://img.shields.io/badge/dependency-mend-blue)](https://developer.mend.io/github/hanggrian/stylebook/)
[![Node](https://img.shields.io/badge/node-12+-informational)](https://nodejs.org/en/blog/release/v12.0.0/)

# Stylebook

Third-party linter rules and configuration for various data formats not
considered as a programming language.

| Language | Linter | Style |
| --- | --- | --- |
| Markdown | [markdownlint](https://github.com/davidanson/markdownlint/) | [GitHub Flavored Markdown Spec](https://github.github.com/gfm/) |
| CSS | [Stylelint](https://github.com/stylelint/stylelint/) | [Mozilla CSS Coding Guide](https://protocol.mozilla.org/docs/contributing/css-guide/) |
| JSON | [JSON Lint](https://github.com/prantlf/jsonlint/) | [JSON5 Spec](https://spec.json5.org/) |

## Download

```sh
npm install stylebook-markdownlint \
  markdownlint markdownlint-cli2 --save-dev
npm install stylebook-stylelint \
  @stylistic/stylelint-plugin stylelint-config-recommended --save-dev
npm install stylebook-jsonlint \
  @prantlf/jsonlint --save-dev
```

## Usage

### markdownlint

No setup is necessary. However, to customize behaviors, a local
`.markdownlint-cli2.json` is needed.

> Default rules are overridden if `--config` is specified in the command.

```sh
stylebook-markdownlint *.md
```

### Stylelint

Create `.stylint.config.js` file in the root directory.

### JSON Lint

No setup is necessary. However, to customize behaviors, a local
`.jsonlintrc.config.json` is needed.

> Default rules are overridden if `-f` or `--config` is specified in the
  command.

```sh
stylebook-jsonlint *.json
```
