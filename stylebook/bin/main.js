#!/usr/bin/env node

import { readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { b, blue, cyan, i, red } from './cli.js';
import HtmlhintCommand from './commands/htmlhint.js';
import JsonlintCommand from './commands/jsonlint.js';
import MarkdownlintCommand from './commands/markdownlint.js';
import StylelintCommand from './commands/stylelint.js';

/**
 * Recursively traverse directories to collect files.
 *
 * @param {string} targetPath
 * @returns {path[]|*[]}
 */
function walk(targetPath) {
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

const APP_BINARY = 'stylebook';
const APP_VERSION = '0.2';

// parse input arguments
const inputArgs = process.argv.slice(2);
let silent = false;
if (!inputArgs.length) {
    process.stdout.write(lines(red('Need a path.')));
    process.exit(1);
}
if (inputArgs.includes('-h') ||
    inputArgs.includes('--help')) {
    process.stdout.write(
        lines(
            'Helper for Stylebook linter extensions',
            '',
            b('Usage:'),
            `  ${cyan(APP_BINARY + ' <paths>')} ${blue('[options]')}`,
            '',
            b(cyan('Paths:')),
            '  file       Supports ' +
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
            '  dir        Recursively find files in this directory',
            `  pattern    For example, ${i('*.json')} for all JSON files in this`,
            `             directory, ${i('**/*')} for all files`,
            '',
            b(blue('Options:')),
            '  -h  [ --help ]                    Display this message',
            '  -s  [ --silent, -q, --quiet ]     Disable verbose output',
            '  -v  [ --version ]                 Show app version',
        ),
    );
    process.exit(0);
}
if (inputArgs.includes('-v') ||
    inputArgs.includes('--version')) {
    process.stdout.write(lines(`${APP_BINARY} ${b(APP_VERSION)}`));
    process.exit(0);
}
if (inputArgs.includes('-s') ||
    inputArgs.includes('--silent') ||
    inputArgs.includes('-q') ||
    inputArgs.includes('--quiet')) {
    silent = true;
}

// insert target paths to corresponding command
const stylelintCommand = new StylelintCommand();
const htmlhintCommand = new HtmlhintCommand();
const jsonlintCommand = new JsonlintCommand();
const markdownlintCommand = new MarkdownlintCommand();
const commands =
    new Map([
        [stylelintCommand, []],
        [htmlhintCommand, []],
        [jsonlintCommand, []],
        [markdownlintCommand, []],
    ]);
inputArgs
    .filter(arg => !['-s', '--silent'].includes(arg))
    .flatMap(arg => walk(arg))
    .forEach(targetPath => {
        switch (extname(targetPath).toLowerCase()) {
            case '.css':
                commands.get(stylelintCommand).push(targetPath);
                break;
            case '.html':
            case '.htm':
            case '.mhtml':
            case '.mhtm':
                commands.get(htmlhintCommand).push(targetPath);
                break;
            case '.json':
            case '.jsonc':
            case '.cjson':
            case '.json5':
                commands.get(jsonlintCommand).push(targetPath);
                break;
            case '.md':
                commands.get(markdownlintCommand).push(targetPath);
                break;
        }
    });

// filter out commands with no target files
const filteredCommands =
    [...commands.entries()]
        .filter(([_, paths]) => paths.length > 0);
if (!silent) {
    process.stdout.write(
        lines(
            ...filteredCommands.flatMap(([command, paths]) => {
                const title = b(command.binary);
                return command.isAvailable()
                    ? [
                        `\u2705 ${title}`,
                        ...paths.map(path => {
                            const extension = extname(path);
                            return '  - ' +
                                path.substring(0, path.length - extension.length) +
                                i(extension);
                        }),
                    ] : [
                        `\u2718 ${title}`,
                    ];
            }),
            '',
        ),
    );
}

// collect exit codes, any non-zero code will be treated as failure
process.exit(
    Math.min(
        1,
        filteredCommands
            .filter(([command, _]) => command.isAvailable())
            .reduce((a, [command, paths]) => a + command.execute(silent, paths), 0),
    ),
);
