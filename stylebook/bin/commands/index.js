import StylelintCommand from './stylelint.js';
import HtmlhintCommand from './htmlhint.js';
import JsonlintCommand from './jsonlint.js';
import MarkdownlintCommand from './markdownlint.js';

const STYLELINT = new StylelintCommand();
const HTMLHINT = new HtmlhintCommand();
const JSONLINT = new JsonlintCommand();
const MARKDOWNLINT = new MarkdownlintCommand();

export { STYLELINT, HTMLHINT, JSONLINT, MARKDOWNLINT };
