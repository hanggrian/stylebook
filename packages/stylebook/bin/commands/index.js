import HtmlhintCommand from './htmlhint.js';
import JsonlintCommand from './jsonlint.js';
import LockfileLintCommand from './lockfile-lint.js';
import MarkdownlintCommand from './markdownlint.js';
import MaidCommand from './maid.js';
import StylelintCommand from './stylelint.js';

const Linter =
    Object.freeze({
        HTMLHINT: new HtmlhintCommand(),
        JSONLINT: new JsonlintCommand(),
        LOCKFILE_LINT: new LockfileLintCommand(),
        MARKDOWNLINT: new MarkdownlintCommand(),
        MAID: new MaidCommand(),
        STYLELINT: new StylelintCommand(),
    });

const NAMES = new Set(Object.values(Linter).map(linter => linter.binary));

export { Linter, NAMES };
