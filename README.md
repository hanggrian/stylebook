[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/hanggrian/stylebook/code-analysis.yml)](https://github.com/hanggrian/stylebook/actions/workflows/code-analysis.yml)
[![Codecov](https://img.shields.io/codecov/c/gh/hanggrian/stylebook)](https://app.codecov.io/gh/hanggrian/stylebook/)
[![Renovate](https://img.shields.io/badge/dependency-mend-blue)](https://developer.mend.io/github/hanggrian/stylebook/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9+-informational)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)

# Stylebook

Proof-of-concept.

| Language | Linter | Style |
| --- | --- | --- |
| Markdown | [markdownlint](https://github.com/davidanson/markdownlint/) | [GitHub Flavored Markdown](https://github.github.com/gfm/) |

## Download

```sh
npm install stylebook-markdownlint markdownlint markdownlint-cli2 --save-dev
```

## Usage

Create `.markdownlint-cli2.json` on local project directory and attach linter in
`package.json` scripts:

```json
{
  "scripts": {
    "lint": "markdownlint-cli2 --config .markdownlint-cli2.json *.md"
  }
}
```
