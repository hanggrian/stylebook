import messages from '../../messages.js';
import StylebookHtmlhintRule from './stylebook-htmlhint-rule.js';
import type { HTMLParser, Reporter } from 'htmlhint/dist/core/core';

class TrailingNewlineRule extends StylebookHtmlhintRule {
    constructor() {
        super('trailing-newline');
    }

    visit(parser: HTMLParser, reporter: Reporter) {
        parser.addListener(
            'end',
            () => {
                // checks for violation
                const rep: any = reporter as any;
                const lines: string[] = rep.lines || [];
                if (lines.length === 0) {
                    return;
                }
                const lastLine = lines[lines.length - 1] || '';
                if (lastLine.trim() === '') {
                    return;
                }
                reporter.warn(
                    messages.get(TrailingNewlineRule.MSG),
                    lines.length,
                    lastLine.length + 1,
                    this,
                    lastLine,
                );
            },
        );
    }

    private static MSG: string = 'trailing.newline';
}

export default new TrailingNewlineRule();
