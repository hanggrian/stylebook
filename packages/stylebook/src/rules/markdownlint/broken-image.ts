import messages from '../../messages.js';
import { truncateOrExpand } from '../../strings.js';
import StylebookMarkdownlintRule from './stylebook-markdown-rule.js';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RuleConfiguration, RuleOnError } from 'markdownlint';

interface ImageOccurrence {
    url: string;
    lineNumber: number;
    context: string;
}

interface FetchResult {
    status: number | null;
    contentType: string | null;
}

class BrokenImageRule extends StylebookMarkdownlintRule {
    constructor() {
        super('broken-image', 'url');
    }

    checkUrls: (
        path: string,
        urls: string[],
        timeout: number,
    ) => FetchResult[] = (path, urls, timeout) =>
        BrokenImageRule.checkUrlsSync(path, urls, timeout);

    visit(path: string, lines: string[], config: RuleConfiguration, onError: RuleOnError) {
        // parse configuration
        const timeout: number = config.timeout ? parseInt(config.timeout) : 6_000;
        const ignoredHosts: string[] =
            Array.isArray(config.ignored_hosts)
                ? config.ignored_hosts
                : ['npmjs.com', 'www.npmjs.com'];

        // reset lastIndex for each line
        const occurrences: ImageOccurrence[] = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            BrokenImageRule.IMAGE_REGEX.lastIndex = 0;
            let match: RegExpExecArray | null;
            while ((match = BrokenImageRule.IMAGE_REGEX.exec(line)) !== null) {
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
            const { status, contentType } = results[i];
            if (status === null || status >= 400) {
                onError({
                    lineNumber,
                    detail: messages.get(BrokenImageRule.MSG_STATUS, url),
                    context,
                });
            } else if (contentType === null || !contentType.startsWith('image/')) {
                onError({
                    lineNumber,
                    detail: messages.get(BrokenImageRule.MSG_CONTENT, url),
                    context,
                });
            }
        }
    }

    private static MSG_STATUS: string = 'broken.image.status';
    private static MSG_CONTENT: string = 'broken.image.content';

    private static IMAGE_REGEX: RegExp =
        /!\[[^\]]*]\((https?:\/\/(?:[^\s()<>[\]]+|\([^\s()<>[\]]+\))+?)\)/g;
    private static USER_AGENT: string = 'markdownlint-rule-broken-image/1.0 (link checker)';
    private static PACKAGE_ROOT: string = join(
        dirname(fileURLToPath(import.meta.url)),
        '../../../',
    );

    private static BAR_CATEGORY: string = truncateOrExpand('broken-image', 12);
    private static BAR_SIZE: number = 32;

    private static checkUrlsSync(
        path: string,
        urls: string[],
        timeout: number,
    ): FetchResult[] {
        try {
            return JSON.parse(
                execSync(
                    'node --input-type=module',
                    {
                        input:
                            `import cliProgress from 'cli-progress/cli-progress.js';

                            const urls = ${JSON.stringify(urls)};
                            const TIMEOUT_MS = ${timeout};
                            const USER_AGENT = ${JSON.stringify(BrokenImageRule.USER_AGENT)};
                            const BAR_SIZE = 35;
                            const bar =
                                process.stderr.isTTY
                                    ? new cliProgress.SingleBar(
                                        {
                                            format:
                                                '${truncateOrExpand(parse(path).name, 24)}   ' +
                                                '${chalk.dim(BrokenImageRule.BAR_CATEGORY)} ' +
                                                '{bar} {value}/{total}',
                                            barsize: ${BrokenImageRule.BAR_SIZE},
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
                                                return {
                                                    status: res.status,
                                                    contentType: res.headers.get('content-type'),
                                                };
                                            } catch {
                                                return { status: null, contentType: null };
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
                        cwd: BrokenImageRule.PACKAGE_ROOT,
                        stdio: ['pipe', 'pipe', 'inherit'],
                    },
                ),
            ) as FetchResult[];
        } catch {
            return urls.map(() => ({ status: null, contentType: null }));
        }
    }
}

export default new BrokenImageRule();
