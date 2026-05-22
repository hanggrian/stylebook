import messages from '../../messages.js';
import StylebookMarkdownlintRule from './stylebook-markdown-rule.js';
import type { RuleConfiguration, RuleOnError } from 'markdownlint';

class UnnecessaryLeadingBlankLineRule extends StylebookMarkdownlintRule {
    constructor() {
        super('unnecessary-leading-blank-line', 'syntax');
    }

    visit(lines: string[], _: RuleConfiguration, onError: RuleOnError) {
        // checks for violation
        if (lines.length === 0 || lines[0].trim() !== '') {
            return;
        }
        onError({
            lineNumber: 1,
            detail: messages.get(UnnecessaryLeadingBlankLineRule.MSG),
            context: lines[0] || '',
        });
    }

    private static MSG: string = 'unnecessary.leading.blank.line';
}

export default new UnnecessaryLeadingBlankLineRule();
