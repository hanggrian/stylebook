#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { b, blue, cyan, d, green, i, red, yellow } from './colors.js';
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
    if (path.split(/[\\/]/).some(part => exclude.has(part)) ||
        !existsSync(path)) {
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

// parse input arguments
let inputArgs = process.argv.slice(2);
const exclude = new Set();
let quiet = false;
if (!inputArgs.length) {
    process.stderr.write(`${red('Need a path.')}\n`);
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
    process.stdout.write('Helper for Stylebook linter extensions\n\n');
    process.stdout.write(`\u{1f680} ${b('Usage:')}\n`);
    process.stdout.write(`   ${APP_BINARY} ${cyan('<paths>')} ${blue('[options]')}\n\n`);
    process.stdout.write(`\u{1f4c4} ${b(cyan('Paths:'))}\n`);
    process.stdout.write(
        '   file      Supports ' +
        `${i('.css')}, ` +
        `${i('.html')}, ` +
        `${i('.htm')}, ` +
        `${i('.mhtml')}, ` +
        `${i('.mthm')}, ` +
        `${i('.json')},\n`,
    );
    process.stdout.write(
        '             ' +
        `${i('.jsonc')}, ` +
        `${i('.cjson')}, ` +
        `${i('.json5')}, ` +
        `${i('.md')}\n`,
    );
    process.stdout.write('   dir       Recursively find files in this directory\n');
    process.stdout.write(`   pattern   For example, ${i('*.json')} for all JSON files in this\n`);
    process.stdout.write(`             directory, ${i('**/*')} for all files\n\n`);
    process.stdout.write(`\u2699\ufe0f  ${b(blue('Options:'))}\n`);
    process.stdout.write('   -e  [ --exclude ] arg   List of files or directories to ignore\n');
    process.stdout.write('   -h  [ --help ]          Display this message\n');
    process.stdout.write('   -q  [ --quiet ]         Disable verbose output\n');
    process.stdout.write('   -v  [ --version ]       Show app version\n');
    process.exit(0);
}
if (inputArgs.includes('-q') ||
    inputArgs.includes('--quiet')) {
    quiet = true;
}
if (inputArgs.includes('-v') ||
    inputArgs.includes('--version')) {
    process.stdout.write(`${APP_BINARY} ${b(APP_VERSION)}\n`);
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
                process.stdout.write(`\u{1f6ab} ${title}: Unavailable\n`);
                return;
            }
            if (!paths.length) {
                process.stdout.write(`\u{1fad9} ${title}: Empty\n`);
                return;
            }
            process.stdout.write(`\u2705\ufe0f ${title}\n`);
            paths
                .map(path => {
                    const extension = extname(path);
                    const root = path.substring(0, path.length - extension.length);
                    const slash = root.lastIndexOf('/') + 1;
                    return '   ' +
                        d(root.substring(0, slash)) +
                        root.substring(slash) +
                        i(extension);
                }).forEach(line => process.stdout.write(`${line}\n`));
        });
    process.stdout.write('\n');
}

// report result
let empty = true;
const violatingLinters =
    [...commands.entries()]
        .filter(([command, paths]) => {
            const filter = command.isAvailable() && paths.length;
            if (filter) {
                empty = false;
            }
            return filter && command.execute(quiet, paths);
        }).map(([command, _]) => command.binary);
if (violatingLinters.length) {
    process.stderr.write(
        '\u274c\ufe0f ' +
        `${red(`Linter(s) reported violations: ${b(`${violatingLinters.join(', ')}.`)}`)}\n`,
    );
    process.exit(1);
}
if (empty) {
    process.stderr.write(`\u{1f47b} ${yellow('No files to lint.')}\n`);
    process.exit(1);
}
process.stdout.write(`\u{1f389} ${green('All linters passed, no violation found.')}\n`);
process.exit(0);
