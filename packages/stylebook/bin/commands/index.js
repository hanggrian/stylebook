import StylelintCommand from './stylelint.js';
import HtmlhintCommand from './htmlhint.js';
import JsonlintCommand from './jsonlint.js';
import LockfileLintCommand from './lockfile-lint.js';
import MarkdownlintCommand from './markdownlint.js';
import MaidCommand from './maid.js';

const STYLELINT = new StylelintCommand();
const HTMLHINT = new HtmlhintCommand();
const JSONLINT = new JsonlintCommand();
const LOCKFILE_LINT = new LockfileLintCommand();
const MARKDOWNLINT = new MarkdownlintCommand();
const MAID = new MaidCommand();

export { STYLELINT, HTMLHINT, JSONLINT, LOCKFILE_LINT, MARKDOWNLINT, MAID };
