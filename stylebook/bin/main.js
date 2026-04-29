#!/usr/bin/env node

import { readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { b, blue, cyan, d, i, red } from './cli.js';
import { HTMLHINT, JSONLINT, MARKDOWNLINT, STYLELINT } from './commands/index.js';

const APP_BINARY = 'stylebook';
const APP_VERSION = '0.2';
const IGNORED_DIRS =
    new Set([
        'node_modules',
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
        'venv',
        '.venv',
        'uv.lock',
    ]);

/**
 * Recursively traverse directories to collect files.
 *
 * @param {string} targetPath
 * @returns {path[]|*[]}
 */
function walk(targetPath) {
    if (targetPath.split(/[\\/]/).some(part => IGNORED_DIRS.has(part))) {
        return [];
    }
    const stats = statSync(targetPath);
    if (stats.isFile()) {
        return [targetPath];
    }
    if (stats.isDirectory()) {
        return readdirSync(targetPath)
            .flatMap(child => walk(join(targetPath, child)));
    }
    return [];
}

/**
 * Convenient method to collect lines into string.
 *
 * @param lines
 * @returns {string}
 */
function lines(...lines) {
    return lines.join('\n') + '\n';
}

// parse input arguments
const inputArgs = process.argv.slice(2);
let silent = false;
if (!inputArgs.length) {
    process.stdin.write(red('Need a path.'));
    process.exit(1);
}
if (inputArgs.includes('-h') ||
    inputArgs.includes('--help')) {
    process.stdout.write(
        lines(
            'Helper for Stylebook linter extensions',
            '',
            `\u{1f680} ${b('Usage:')}`,
            `   ${APP_BINARY} ${cyan('<paths>')} ${blue('[options]')}`,
            '',
            `\u{1f4c4} ${b(cyan('Paths:'))}`,
            '   file      Supports ' +
            `${i('.css')}, ` +
            `${i('.html')}, ` +
            `${i('.htm')}, ` +
            `${i('.mhtml')}, ` +
            `${i('.mthm')}, ` +
            `${i('.json')},`,
            '             ' +
            `${i('.jsonc')}, ` +
            `${i('.cjson')}, ` +
            `${i('.json5')}, ` +
            i('.md'),
            '   dir       Recursively find files in this directory',
            `   pattern   For example, ${i('*.json')} for all JSON files in this`,
            `             directory, ${i('**/*')} for all files`,
            '',
            `\u2699\ufe0f  ${b(blue('Options:'))}`,
            '   -h  [ --help ]      Display this message',
            '   -q  [ --quiet ]     Disable verbose output',
            '   -v  [ --version ]   Show app version',
        ),
    );
    process.exit(0);
}
if (inputArgs.includes('-v') ||
    inputArgs.includes('--version')) {
    process.stdout.write(lines(`${APP_BINARY} ${b(APP_VERSION)}`));
    process.exit(0);
}
if (inputArgs.includes('-q') ||
    inputArgs.includes('--quiet')) {
    silent = true;
}

// insert target paths to corresponding command
const commands =
    new Map([
        [STYLELINT, []],
        [HTMLHINT, []],
        [JSONLINT, []],
        [MARKDOWNLINT, []],
    ]);
inputArgs
    .filter(arg => !['-q', '--quiet'].includes(arg))
    .flatMap(arg => walk(arg))
    .forEach(targetPath => {
        switch (extname(targetPath).toLowerCase()) {
            case '.css':
                commands.get(STYLELINT).push(targetPath);
                break;
            case '.html':
            case '.htm':
            case '.mhtml':
            case '.mhtm':
                commands.get(HTMLHINT).push(targetPath);
                break;
            case '.json':
            case '.jsonc':
            case '.cjson':
            case '.json5':
                commands.get(JSONLINT).push(targetPath);
                break;
            case '.md':
                commands.get(MARKDOWNLINT).push(targetPath);
                break;
        }
    });

// filter out commands with no target files
if (!silent) {
    commands
        .entries()
        .forEach(([command, paths]) => {
            const title = b(command.binary);
            if (!command.isAvailable()) {
                process.stdout.write(lines(`\u274c ${title}: Unavailable`));
                return;
            }
            if (!paths.length) {
                process.stdout.write(lines(`\u26a0\ufe0f  ${title}: Empty`));
                return;
            }
            process.stdout.write(
                lines(
                    ...[
                        `\u2705 ${title}`,
                        ...paths.map(path => {
                            const extension = extname(path);
                            const root = path.substring(0, path.length - extension.length);
                            const slash = root.lastIndexOf('/') + 1;
                            return '   ' +
                                d(root.substring(0, slash)) +
                                root.substring(slash) +
                                i(extension);
                        }),
                    ],
                ),
            );
        });
    process.stdout.write(lines());
}

// collect exit codes, any non-zero code will be treated as failure
process.exit(
    Math.min(
        1,
        commands
            .entries()
            .filter(([command, paths]) => command.isAvailable() && paths.length)
            .reduce((a, [command, paths]) => a + command.execute(silent, paths), 0),
    ),
);
