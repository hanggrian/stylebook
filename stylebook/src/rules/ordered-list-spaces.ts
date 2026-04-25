import messages from '../messages.js';
import StylebookRule from './stylebook-rule.js';
import type { RuleOnError, RuleParams } from 'markdownlint';

class OrderedListSpacesRule extends StylebookRule {
    constructor() {
        super('ordered-list-spaces', 'syntax');
    }

    override function: (params: RuleParams, onError: RuleOnError) => void =
        ({ lines }, onError): void => {
            for (let i = 0; i < lines.length; i++) {
                // filter list item
                const line: string = lines[i];
                const match: RegExpExecArray | null = OrderedListSpacesRule.LIST_ITEM.exec(line);
                if (!match) {
                    continue;
                }

                // checks for violation
                const indent: string = match[1];
                const marker: string = match[2];
                const spacing: string = match[3];
                const prefixLen: number = marker.length;
                const expectedSpaces: number = prefixLen % 2 === 0 ? 2 : 1;
                if (spacing.length === expectedSpaces) {
                    continue;
                }
                onError({
                    lineNumber: i + 1,
                    detail:
                        messages.get(
                            expectedSpaces === 1
                                ? OrderedListSpacesRule.MSG_SINGLE
                                : OrderedListSpacesRule.MSG_MULTI,
                        ),
                    context: line.trim(),
                    fixInfo: {
                        lineNumber: i + 1,
                        editColumn: indent.length + marker.length + 1,
                        deleteCount: spacing.length,
                        insertText: ' '.repeat(prefixLen % 2 === 0 ? 2 : 1),
                    },
                });
            }
        };

    static MSG_SINGLE: string = 'ordered.list.spaces.single';
    static MSG_MULTI: string = 'ordered.list.spaces.multi';

    static LIST_ITEM: RegExp = /^(\s*)(\d+\.)( +)\S/;
}

export default new OrderedListSpacesRule();
