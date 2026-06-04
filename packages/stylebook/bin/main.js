#!/usr/bin/env node
// noinspection ES6UnusedImports

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { b, blue, cyan, d, green, i, magenta, red, yellow } from './colors.js';
// eslint-disable-next-line no-unused-vars
import Command from './commands/command.js';
import { Linter, NAMES } from './commands/index.js';
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

/**
 * Insert path to map if the linter key exists.
 *
 * @param {Map} commands
 * @param {Command} linter
 * @param {path} path
 */
function register(commands, linter, path) {
    const paths = commands.get(linter);
    if (paths !== undefined) {
        paths.push(path);
    }
}

// parse input arguments
let inputArgs = process.argv.slice(2);
const disable = new Set();
const unsupportedDisable = new Set();
const exclude = new Set();
let quiet = false;
if (!inputArgs.length) {
    process.stderr.write(`${red('Need a path.')}\n`);
    process.exit(1);
}
for (const arg of inputArgs) {
    if (!arg.startsWith('-d=') &&
        !arg.startsWith('--disable=') &&
        !arg.startsWith('-e=') &&
        !arg.startsWith('--exclude=')) {
        continue;
    }
    inputArgs = inputArgs.filter(a => a !== arg);
    for (const a of arg.substring(arg.indexOf('=') + 1).split(',')) {
        if (arg.startsWith('-d=') ||
            arg.startsWith('--disable=')) {
            (NAMES.has(a) ? disable : unsupportedDisable).add(a);
            continue;
        }
        exclude.add(a);
    }
}
if (unsupportedDisable.size) {
    process.stderr.write(
        `${red(`Unsupported linter: ${b([...unsupportedDisable].join(', '))}`)}\n`,
    );
    process.exit(1);
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
    process.stdout.write(`   ${magenta('file')}      Supports file types and their variants:\n`);
    process.stdout.write(
        '             ' +
        '\u2022 CSS        ' +
        '\u2022 GraphQL    ' +
        '\u2022 HTML      ' +
        '\u2022 JSON\n',
    );
    process.stdout.write(
        '             ' +
        '\u2022 Lockfile   ' +
        '\u2022 Markdown   ' +
        '\u2022 Mermaid\n',
    );
    process.stdout.write(`   ${magenta('dir')}       Recursively find files in this directory\n`);
    process.stdout.write(
        `   ${magenta('pattern')}   For example, ${i('*.css')} for all CSS files in this\n`,
    );
    process.stdout.write(`             directory, ${i('**/*')} for all files\n\n`);
    process.stdout.write(`\u2699\ufe0f  ${b(blue('Options:'))}\n`);
    process.stdout.write(
        `   ${blue('-d')}, ${blue('--disable')} ${d(blue('[LINTERS]'))}     ` +
        'List of linters to deactivate:\n',
    );
    process.stdout.write(
        '                               ' +
        `\u2022 ${Linter.GRAPHQL_SCHEMA_LINTER.binary}   ` +
        `\u2022 ${Linter.HTMLHINT.binary}\n`,
    );
    process.stdout.write(
        '                               ' +
        `\u2022 ${Linter.JSONLINT.binary}                ` +
        `\u2022 ${Linter.LOCKFILE_LINT.binary}\n`,
    );
    process.stdout.write(
        '                               ' +
        `\u2022 ${Linter.MARKDOWNLINT.binary}            ` +
        `\u2022 ${Linter.MAID.binary}\n`,
    );
    process.stdout.write(
        '                               ' +
        `\u2022 ${Linter.STYLELINT.binary}\n`,
    );
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
    new Map(
        Object
            .values(Linter)
            .filter(linter => !disable.has(linter.binary))
            .map(linter => [linter, []]),
    );
inputArgs
    .filter(arg => !['-q', '--quiet'].includes(arg))
    .flatMap(arg => walk(arg, exclude))
    .filter((path, index, self) => self.indexOf(path) === index)
    .forEach(targetPath => {
        const filename = basename(targetPath);
        if (filename === 'package-lock.json' ||
            filename === 'npm-shrink.json' ||
            filename === 'yarn.lock') {
            register(commands, Linter.LOCKFILE_LINT, targetPath);
            return;
        }
        switch (extname(targetPath).toLowerCase()) {
            case '.css':
                register(commands, Linter.STYLELINT, targetPath);
                break;

            case '.gql':
            case '.graphql':
            case '.gqls':
            case '.graphqls':
                register(commands, Linter.GRAPHQL_SCHEMA_LINTER, targetPath);
                break;

            case '.html':
            case '.htm':
                register(commands, Linter.HTMLHINT, targetPath);
                break;

            case '.json':
            case '.jsonc':
            case '.cjson':
            case '.json5':
                register(commands, Linter.JSONLINT, targetPath);
                break;

            case '.md':
            case '.markdown':
                register(commands, Linter.MARKDOWNLINT, targetPath);
                break;

            case '.mmd':
            case '.mermaid':
                register(commands, Linter.MAID, targetPath);
                break;
        }
    });

// filter out commands with no target files
if (!quiet) {
    commands
        .entries()
        .forEach(([command, paths]) => {
            if (!paths.length) {
                return;
            }
            const title = b(command.binary);
            if (!command.isAvailable()) {
                process.stdout.write(`\u{1f6ab} ${title}: Unavailable\n`);
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
(async () => {
    let empty = true;
    const violatingLinters = [];
    for (const [command, paths] of commands.entries()) {
        const filter = command.isAvailable() && paths.length;
        if (filter) {
            empty = false;
        }
        if (filter && await command.execute(process.cwd(), paths, quiet)) {
            violatingLinters.push(command.binary);
        }
    }
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
})();
