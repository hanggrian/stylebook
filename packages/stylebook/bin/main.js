#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { b, blue, cyan, d, green, i, magenta, red, yellow } from './colors.js';
import {
    HTMLHINT,
    JSONLINT,
    LOCKFILE_LINT,
    MAID,
    MARKDOWNLINT,
    STYLELINT,
} from './commands/index.js';
import { getConfigFile } from './files.js';

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
    process.stdout.write('Node runner for Stylebook linter aggregator\n\n');
    process.stdout.write(`\u{1f680} ${b(cyan('Usage:'))}\n`);
    process.stdout.write(`   ${cyan('stylebook')} ${magenta('[PATHS]')} ${blue('[OPTIONS]')}\n\n`);
    process.stdout.write(`\u{1f4c4} ${b(magenta('Paths:'))}\n`);
    process.stdout.write(
        `   ${magenta('file')}      Supports ` +
        `${i('CSS')}, ` +
        `${i('HTML')}, ` +
        `${i('JSON')}, ` +
        `${i('Lockfile')}, ` +
        `${i('Markdown')}, ` +
        `${i('Mermaid')} and their\n`,
    );
    process.stdout.write('             variants\n');
    process.stdout.write(`   ${magenta('dir')}       Recursively find files in this directory\n`);
    process.stdout.write(
        `   ${magenta('pattern')}   For example, ${i('*.css')} for all CSS files in this\n`
    );
    process.stdout.write(`             directory, ${i('**/*')} for all files\n\n`);
    process.stdout.write(`\u2699\ufe0f  ${b(blue('Options:'))}\n`);
    process.stdout.write(
        `   ${blue('-e')}, ${blue('--exclude')} ${d(blue('[ARGUMENTS]'))}   ` +
        'List of files or directories to ignore\n',
    );
    process.stdout.write(
        `   ${blue('-h')}, ${blue('--help')}                  ` +
        'Display this message\n',
    );
    process.stdout.write(
        `   ${blue('-q')}, ${blue('--quiet')}                 ` +
        'Disable verbose output\n',
    );
    process.stdout.write(
        `   ${blue('-v')}, ${blue('--version')}               ` +
        'Show app version\n',
    );
    process.exit(0);
}
if (inputArgs.includes('-q') ||
    inputArgs.includes('--quiet')) {
    quiet = true;
}
if (inputArgs.includes('-v') ||
    inputArgs.includes('--version')) {
    process.stdout.write(
        'stylebook ' +
        `${b(JSON.parse(
            readFileSync(
                join(dirname(fileURLToPath(import.meta.url)), `../package.json`),
                'utf-8',
            ),
        ).version)}\n`,
    );
    process.exit(0);
}

// insert target paths to corresponding command
const commands =
    new Map([
        [STYLELINT, []],
        [HTMLHINT, []],
        [JSONLINT, []],
        [LOCKFILE_LINT, []],
        [MAID, []],
        [MARKDOWNLINT, []],
    ]);
inputArgs
    .filter(arg => !['-q', '--quiet'].includes(arg))
    .flatMap(arg => walk(arg, exclude))
    .filter((path, index, self) => self.indexOf(path) === index)
    .forEach(targetPath => {
        const filename = basename(targetPath);
        if (filename === 'package-lock.json' ||
            filename === 'npm-shrink.json' ||
            filename === 'yarn.lock') {
            commands.get(LOCKFILE_LINT).push(targetPath);
            return;
        }
        switch (extname(targetPath).toLowerCase()) {
            case '.css':
                commands.get(STYLELINT).push(targetPath);
                break

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

            case '.mmd':
            case '.mermaid':
                commands.get(MAID).push(targetPath);
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
if (!quiet) {
    process.stdout.write(`\u{1f389} ${green('All linters passed, no violation found.')}\n`);
}
process.exit(0);
