import messages from '../messages.js';
import StylebookRule from './stylebook-rule.js';
import type { RuleOnError } from 'markdownlint';

class OrderedListNumberRule extends StylebookRule {
    constructor() {
        super('ordered-list-number', 'syntax');
    }

    visit(lines: string[], onError: RuleOnError) {
        const prevByIndent = new Map<number, number>();
        for (let i = 0; i < lines.length; i++) {
            // non-list item, clear
            const line: string = lines[i];
            const match: RegExpExecArray | null = OrderedListNumberRule.LIST_ITEM.exec(line);
            if (!match) {
                prevByIndent.clear();
                continue;
            }

            // checks for violation
            const indent: number = match[1].length;
            const number: number = parseInt(match[2], 10);
            const prev: number | undefined = prevByIndent.get(indent);
            if (prev !== undefined && number > prev) {
                onError({
                    lineNumber: i + 1,
                    detail: messages.get(OrderedListNumberRule.MSG, String(prev)),
                    context: line.trim(),
                });
                continue;
            }

            // nested list started, clear deeper levels
            for (const key of prevByIndent.keys()) {
                if (key > indent) {
                    prevByIndent.delete(key);
                }
            }
            prevByIndent.set(indent, number);
        }
    }

    private static MSG: string = 'ordered.list.number';

    private static LIST_ITEM: RegExp = /^(\s*)(\d+)\.\s/;
}

export default new OrderedListNumberRule();
