import messages from '../../messages.js';
import StylebookMarkdownlintRule from './stylebook-markdown-rule.js';
import type { RuleConfiguration, RuleOnError } from 'markdownlint';

class UnnecessaryBlankLineInListRule extends StylebookMarkdownlintRule {
    constructor() {
        super('unnecessary-blank-line-in-list', 'syntax');
    }

    visit(lines: string[], _: RuleConfiguration, onError: RuleOnError) {
        for (let i = 0; i < lines.length; i++) {
            // target blank lines
            const line: string = lines[i];
            if (!UnnecessaryBlankLineInListRule.isBlank(line)) {
                continue;
            }

            // skip if previous is content inside list item
            const prevLine: string | undefined =
                lines
                    .slice(0, i)
                    .reverse()
                    .find(l => !UnnecessaryBlankLineInListRule.isBlank(l));
            if (!prevLine ||
                !UnnecessaryBlankLineInListRule.ANY_ITEM.test(prevLine)) {
                continue;
            }

            // collect non-blank lines
            const remaining: string[] = lines.slice(i + 1);
            const nextNonEmpty: string | undefined =
                remaining.find(l => !UnnecessaryBlankLineInListRule.isBlank(l));
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
                            !UnnecessaryBlankLineInListRule.isBlank(l) &&
                            !UnnecessaryBlankLineInListRule.ANY_ITEM.test(l),
                    ) ||
                !UnnecessaryBlankLineInListRule.ANY_ITEM.test(nextNonEmpty) ||
                UnnecessaryBlankLineInListRule.ORDERED_ITEM.test(prevLine) !==
                UnnecessaryBlankLineInListRule.ORDERED_ITEM.test(nextNonEmpty) ||
                UnnecessaryBlankLineInListRule.indent(prevLine) !==
                UnnecessaryBlankLineInListRule.indent(nextNonEmpty)) {
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

    private static MSG: string = 'unnecessary.blank.line.in.list';

    private static ANY_ITEM: RegExp = /^\s*(\d+\.|[-*+])\s/;
    private static ORDERED_ITEM: RegExp = /^\s*\d+\.\s/;

    private static isBlank(s: string): boolean {
        return s.trim() === '';
    }

    private static indent(line: string): number {
        return line.match(/^(\s*)/)?.[1].length ?? 0;
    }
}

export default new UnnecessaryBlankLineInListRule();
