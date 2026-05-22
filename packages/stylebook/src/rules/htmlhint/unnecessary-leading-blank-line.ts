import messages from '../../messages.js';
import StylebookHtmlhintRule from './stylebook-htmlhint-rule.js';
import type { HTMLParser, Reporter } from 'htmlhint/dist/core/core';

class UnnecessaryLeadingBlankLineRule extends StylebookHtmlhintRule {
    constructor() {
        super('unnecessary-leading-blank-line');
    }

    visit(parser: HTMLParser, reporter: Reporter) {
        parser.addListener(
            'end',
            () => {
                // checks for violation
                const rep: any = reporter as any;
                const lines: string[] = rep.lines || [];
                if (lines.length === 0 || lines[0].trim() !== '') {
                    return;
                }
                reporter.warn(
                    messages.get(UnnecessaryLeadingBlankLineRule.MSG),
                    1,
                    1,
                    this,
                    lines[0] || '',
                );
            },
        );
    }

    private static MSG: string = 'unnecessary.leading.blank.line';
}

export default new UnnecessaryLeadingBlankLineRule();
