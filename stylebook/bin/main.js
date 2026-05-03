#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { b, blue, cyan, d, green, i, red } from './colors.js';
import { HTMLHINT, JSONLINT, MARKDOWNLINT, STYLELINT } from './commands/index.js';
import { getConfigFile } from './files.js';

const APP_BINARY = 'stylebook';
const APP_VERSION = '0.2';

/**
 * Recursively traverse directories to collect files.
 *
 * @param {string} path
 * @param {string[]} exclude
 * @returns {path[]|*[]}
 */
function walk(path, exclude) {
    if (path.split(/[\\/]/).some(part => exclude.has(part))) {
        return [];
    }
    const stats = statSync(path);
    if (stats.isFile()) {
        return [path];
    }
    if (stats.isDirectory()) {
        return readdirSync(path)
            .flatMap(child => walk(join(path, child), exclude));
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
let inputArgs = process.argv.slice(2);
const exclude = new Set();
let quiet = false;
if (!inputArgs.length) {
    process.stderr.write(lines(red('Need a path.')));
    process.exit(1);
}
for (const arg of inputArgs) {
    if (!arg.startsWith('-e=') && !arg.startsWith('--exclude=')) {
        continue;
    }
    inputArgs = inputArgs.filter(a => a !== arg);
    arg
        .substring(arg.indexOf('=') + 1)
        .split(',')
        .forEach(a => exclude.add(a));
    break;
}
if (!exclude.size) {
    readFileSync(getConfigFile('stylebookrc'), 'UTF-8')
        .split(/\r?\n/)
        .forEach(line => {
            line = line.trim();
            if (!line.length || line.startsWith('#')) {
                return;
            }
            exclude.add(
                line.endsWith('/')
                    ? line.slice(0, -1)
                    : line,
            );
        });
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
            '   -e  [ --exclude ] arg (=[])   List of files or directories to ignore',
            '   -h  [ --help ]                Display this message',
            '   -q  [ --quiet ]               Disable verbose output',
            '   -v  [ --version ]             Show app version',
        ),
    );
    process.exit(0);
}
if (inputArgs.includes('-q') ||
    inputArgs.includes('--quiet')) {
    quiet = true;
}
if (inputArgs.includes('-v') ||
    inputArgs.includes('--version')) {
    process.stdout.write(lines(`${APP_BINARY} ${b(APP_VERSION)}`));
    process.exit(0);
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
    .flatMap(arg => walk(arg, exclude))
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
if (!quiet) {
    commands
        .entries()
        .forEach(([command, paths]) => {
            const title = b(command.binary);
            if (!command.isAvailable()) {
                process.stdout.write(lines(`\u{1f6ab} ${title}: Unavailable`));
                return;
            }
            if (!paths.length) {
                process.stdout.write(lines(`\u{1f47b} ${title}: Empty`));
                return;
            }
            process.stdout.write(
                lines(
                    ...[
                        `\u2705\ufe0f ${title}`,
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

// report result
const violatingLinters =
    [...commands.entries()]
        .filter(([command, paths]) =>
            command.isAvailable() && paths.length && command.execute(quiet, paths),
        ).map(([command, _]) => command.binary);
if (violatingLinters.length) {
    process.stderr.write(
        lines(
            '\u274C\ufe0f' +
            `${red(`Linter(s) reported violations: ${b(`${violatingLinters.join(", ")}.`)}`)}`,
        ),
    );
    process.exit(1);
}
process.stdout.write(lines(`\u{1f389} ${green("All linters passed, no violation found.")}`));
process.exit(0);
