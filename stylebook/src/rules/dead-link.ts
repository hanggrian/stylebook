import StylebookRule from './stylebook-rule.js';
import messages from '../messages.js';
import { execSync } from 'node:child_process';
import type { RuleConfiguration, RuleOnError } from 'markdownlint';

interface LinkOccurrence {
    url: string;
    lineNumber: number;
    context: string;
}

class DeadLinkRule extends StylebookRule {
    constructor() {
        super('dead-link', 'url');
    }

    visit(lines: string[], config: RuleConfiguration, onError: RuleOnError) {
        // parse configuration
        const timeout: number = config.timeout ? parseInt(config.timeout) : 10_000;
        const ignoredHosts: string[] =
            Array.isArray(config.ignored_hosts)
                ? config.ignored_hosts
                : ['npmjs.com', 'www.npmjs.com'];

        // reset lastIndex for each line
        const occurrences: LinkOccurrence[] = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            DeadLinkRule.URL_REGEX.lastIndex = 0;
            let match: RegExpExecArray | null;
            while ((match = DeadLinkRule.URL_REGEX.exec(line)) !== null) {
                occurrences.push({
                    url: match[1],
                    lineNumber: i + 1,
                    context: line,
                });
            }
        }
        if (!occurrences.length) {
            return;
        }

        // checks for violation
        const filtered = occurrences.filter(o => !ignoredHosts.includes(new URL(o.url).hostname));
        if (!filtered.length) {
            return;
        }
        const results = DeadLinkRule.checkUrlsSync(filtered.map(o => o.url), timeout);
        for (let i = 0; i < filtered.length; i++) {
            const { url, lineNumber, context } = filtered[i];
            const status = results[i];
            if (status !== null && status < 400) {
                continue;
            }
            onError({
                lineNumber,
                detail: messages.get(DeadLinkRule.MSG, url),
                context,
            });
        }
    }

    private static MSG: string = 'dead.link';

    private static URL_REGEX: RegExp = /(?<!!)\[[^\]]*]\((https?:\/\/[^)\s]+)\)/g;
    private static USER_AGENT: string = 'markdownlint-rule-dead-link/1.0 (link checker)';

    private static checkUrlsSync(urls: string[], timeout: number): (number | null)[] {
        try {
            const stdout =
                execSync(
                    'node --input-type=module',
                    {
                        input:
                            `const urls = ${JSON.stringify(urls)};
                            const TIMEOUT_MS = ${timeout};
                            const USER_AGENT = ${JSON.stringify(DeadLinkRule.USER_AGENT)};
                            process.stdout.write(
                                JSON.stringify(
                                    await Promise.all(
                                        urls.map(async (url) => {
                                            try {
                                                const signal = AbortSignal.timeout(TIMEOUT_MS);
                                                const headers = { 'User-Agent': USER_AGENT };
                                                let res =
                                                    await fetch(
                                                        url,
                                                        {
                                                            method: 'HEAD',
                                                            signal,
                                                            headers,
                                                            redirect: 'follow',
                                                        },
                                                    );
                                                if (res.status === 405) {
                                                    res =
                                                        await fetch(
                                                            url,
                                                            {
                                                                method: 'GET',
                                                                signal,
                                                                headers,
                                                                redirect: 'follow',
                                                            },
                                                        );
                                                }
                                                return res.status;
                                            } catch {
                                                return null;
                                            }
                                        }),
                                    ),
                                ),
                            );`,
                        timeout: timeout * urls.length + 5_000,
                        encoding: 'utf-8',
                        stdio: ['pipe', 'pipe', 'ignore'],
                    });
            return JSON.parse(stdout) as (number | null)[];
        } catch {
            return urls.map(() => null);
        }
    }
}

export default new DeadLinkRule();
