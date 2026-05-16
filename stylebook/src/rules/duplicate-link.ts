import StylebookRule from './stylebook-rule.js';
import messages from '../messages.js';
import type { RuleConfiguration, RuleOnError } from 'markdownlint';

interface LinkOccurrence {
    lineNumber: number;
    context: string;
}

class DuplicateLinkRule extends StylebookRule {
    constructor() {
        super('duplicate-link', 'links');
    }

    visit(lines: string[], _: RuleConfiguration, onError: RuleOnError): void {
        // collect urls
        const urls = new Map<string, LinkOccurrence[]>();
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            DuplicateLinkRule.INLINE_LINK_REGEX.lastIndex = 0;
            let match: RegExpExecArray | null;
            while ((match = DuplicateLinkRule.INLINE_LINK_REGEX.exec(line)) !== null) {
                const url = match[1];
                if (!urls.has(url)) {
                    urls.set(url, []);
                }
                urls.get(url)!.push({ lineNumber: i + 1, context: line });
            }
        }

        // checks for violation
        for (const [url, occurrences] of urls) {
            if (occurrences.length < 2) {
                continue;
            }
            for (const { lineNumber, context } of occurrences) {
                onError({
                    lineNumber,
                    detail: messages.get(DuplicateLinkRule.MSG, url),
                    context,
                });
            }
        }
    }

    private static MSG: string = 'duplicate.link';

    private static INLINE_LINK_REGEX: RegExp = /(?<!!)\[[^\]]*]\((https?:\/\/[^)\s]+)\)/g;
}

export default new DuplicateLinkRule();
