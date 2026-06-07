import AslValidatorCommand from './asl-validator.js';
import HtmlhintCommand from './htmlhint.js';
import GraphqlSchemaLinterCommand from './graphql-schema-linter.js';
import JsonlintCommand from './jsonlint.js';
import LockfileLintCommand from './lockfile-lint.js';
import MarkdownlintCommand from './markdownlint.js';
import MaidCommand from './maid.js';
import StylelintCommand from './stylelint.js';
import TektonLintCommand from './tekton-lint.js';

const Linter =
    Object.freeze({
        ASL_VALIDATOR: new AslValidatorCommand(),
        HTMLHINT: new HtmlhintCommand(),
        GRAPHQL_SCHEMA_LINTER: new GraphqlSchemaLinterCommand(),
        JSONLINT: new JsonlintCommand(),
        LOCKFILE_LINT: new LockfileLintCommand(),
        MARKDOWNLINT: new MarkdownlintCommand(),
        MAID: new MaidCommand(),
        STYLELINT: new StylelintCommand(),
        TEKTON_LINT: new TektonLintCommand(),
    });

const NAMES = new Set(Object.values(Linter).map(linter => linter.binary));

export { Linter, NAMES };
