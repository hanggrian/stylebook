import messages from '../messages.js';
import StylebookRule from './stylebook-rule.js';
import type { RuleOnError } from 'markdownlint';

class UnnecessaryBlankLineInListRule extends StylebookRule {
    constructor() {
        super('unnecessary-blank-line-in-list', 'syntax');
    }

    visit(lines: string[], onError: RuleOnError) {
        for (let i = 0; i < lines.length; i++) {
            // target blank lines
            const line: string = lines[i];
            if (!this.isBlank(line)) {
                continue;
            }

            // skip if previous is content inside list item
            const prevLine: string | undefined =
                lines
                    .slice(0, i)
                    .reverse()
                    .find(l => !this.isBlank(l));
            if (!prevLine ||
                !UnnecessaryBlankLineInListRule.ANY_ITEM.test(prevLine)) {
                continue;
            }

            // collect non-blank lines
            const remaining: string[] = lines.slice(i + 1);
            const nextNonEmpty: string | undefined = remaining.find(l => !this.isBlank(l));
            if (!nextNonEmpty) {
                continue;
            }

            // checks for violation
            const nextNonEmptyIndex: number = remaining.indexOf(nextNonEmpty);
            const nextListItem: string | undefined =
                remaining
                    .slice(nextNonEmptyIndex)
                    .find(l => UnnecessaryBlankLineInListRule.ANY_ITEM.test(l));
            if (remaining
                    .slice(
                        nextNonEmptyIndex,
                        nextListItem
                            ? remaining.indexOf(nextListItem, nextNonEmptyIndex)
                            : undefined,
                    ).some(
                        l =>
                            !this.isBlank(l) &&
                            !UnnecessaryBlankLineInListRule.ANY_ITEM.test(l),
                    ) ||
                !UnnecessaryBlankLineInListRule.ANY_ITEM.test(nextNonEmpty) ||
                UnnecessaryBlankLineInListRule.ORDERED_ITEM.test(prevLine) !==
                UnnecessaryBlankLineInListRule.ORDERED_ITEM.test(nextNonEmpty) ||
                this.indent(prevLine) !== this.indent(nextNonEmpty)) {
                continue;
            }

            onError({
                lineNumber: i + 1,
                detail: messages.get(UnnecessaryBlankLineInListRule.MSG),
                context: line,
                fixInfo: {
                    lineNumber: i + 1,
                    deleteCount: 0,
                    insertText: '',
                },
            });
        }
    }

    isBlank(s: string): boolean {
        return s.trim() === '';
    }

    indent(line: string): number {
        return line.match(/^(\s*)/)?.[1].length ?? 0;
    }

    private static MSG: string = 'unnecessary.blank.line.in.list';

    private static ANY_ITEM: RegExp = /^\s*(\d+\.|[-*+])\s/;
    private static ORDERED_ITEM: RegExp = /^\s*\d+\.\s/;
}

export default new UnnecessaryBlankLineInListRule();
