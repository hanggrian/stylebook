import messages from '../../messages.js';
import { truncateOrExpand } from '../../strings.js';
import StylebookMarkdownlintRule from './stylebook-markdown-rule.js';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RuleConfiguration, RuleOnError } from 'markdownlint';

interface LinkOccurrence {
    url: string;
    lineNumber: number;
    context: string;
}

class DeadLinkRule extends StylebookMarkdownlintRule {
    constructor() {
        super('dead-link', 'url');
    }

    checkUrls: (
        path: string,
        urls: string[],
        timeout: number,
    ) => (number | null)[] = (path, urls, timeout) =>
        DeadLinkRule.checkUrlsSync(path, urls, timeout);

    visit(path: string, lines: string[], config: RuleConfiguration, onError: RuleOnError) {
        // parse configuration
        const timeout: number = config.timeout ? parseInt(config.timeout) : 6_000;
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
        const results = this.checkUrls(path, filtered.map(o => o.url), timeout);
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

    private static URL_REGEX: RegExp =
        /(?<!!)\[[^\]]*]\((https?:\/\/(?:[^\s()<>\[\]]+|\((?:[^\s()<>\[\]]+)\))+?)\)/g;
    private static USER_AGENT: string = 'markdownlint-rule-dead-link/1.0 (link checker)';
    private static PACKAGE_ROOT: string = join(
        dirname(fileURLToPath(import.meta.url)),
        '../../../',
    );

    private static BAR_CATEGORY: string = truncateOrExpand('dead-link', 12);
    private static BAR_SIZE: number = 32;

    private static checkUrlsSync(
        path: string,
        urls: string[],
        timeout: number,
    ): (number | null)[] {
        try {
            return JSON.parse(
                execSync(
                    'node --input-type=module',
                    {
                        input:
                            `import cliProgress from 'cli-progress/cli-progress.js';

                            const urls = ${JSON.stringify(urls)};
                            const TIMEOUT_MS = ${timeout};
                            const USER_AGENT = ${JSON.stringify(DeadLinkRule.USER_AGENT)};
                            const BAR_SIZE = 35;
                            const bar =
                                process.stderr.isTTY
                                    ? new cliProgress.SingleBar(
                                        {
                                            format:
                                                '${truncateOrExpand(parse(path).name, 24)}   ' +
                                                '${chalk.dim(DeadLinkRule.BAR_CATEGORY)} ' +
                                                '{bar} {value}/{total}',
                                            barsize: ${DeadLinkRule.BAR_SIZE},
                                        },
                                        cliProgress.Presets.rect,
                                    ) : null;
                            if (bar) {
                                bar.start(urls.length, 0);
                            }
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
                                            } finally {
                                                if (bar) {
                                                    bar.increment();
                                                }
                                            }
                                        }),
                                    ),
                                ),
                            );
                            if (bar) {
                                bar.stop();
                            }`,
                        timeout: timeout * urls.length + 3_000,
                        encoding: 'utf-8',
                        cwd: DeadLinkRule.PACKAGE_ROOT,
                        stdio: ['pipe', 'pipe', 'inherit'],
                    },
                ),
            ) as (number | null)[];
        } catch {
            return urls.map(() => null);
        }
    }
}

export default new DeadLinkRule();
