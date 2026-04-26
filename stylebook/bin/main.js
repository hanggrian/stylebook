#!/usr/bin/env node

import { readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import HtmlhintCommand from './commands/htmlhint.js';
import JsonlintCommand from './commands/jsonlint.js';
import MarkdownlintCommand from './commands/markdownlint.js';
import StylelintCommand from './commands/stylelint.js';

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

const inputArgs = process.argv.slice(2);
if (!inputArgs.length) {
    console.error('Need a path.');
    process.exit(1);
}

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

process.exit(
    Math.min(
        1,
        [...commands.entries()]
            .filter(([_, paths]) => paths.length > 0)
            .reduce((a, [command, paths]) => a + command.execute(paths), 0),
    ),
);
