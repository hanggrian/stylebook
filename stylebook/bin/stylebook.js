#!/usr/bin/env node

import { readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { JsonlintCommand, MarkdownlintCommand, StylelintCommand } from './commands.js';

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
if (inputArgs.length === 0) {
    console.error('Need a path.');
    process.exit(1);
}

const targetPaths = inputArgs.flatMap(arg => walk(arg));
const jsonExtensions = new Set(['.json', '.jsonc', '.cjson', '.json5']);
const extensions =
    new Set(targetPaths.map(f => {
        const ext = extname(f).toLowerCase();
        return jsonExtensions.has(ext) ? '.json' : ext;
    }));
if (!extensions.size) {
    console.error('Only supports single file type.');
    process.exit(1);
}

let command;
extensions.forEach(ext => {
    switch (ext) {
        case '.md':
            command = new MarkdownlintCommand(targetPaths);
            break;
        case '.json':
            command = new JsonlintCommand(targetPaths);
            break;
        case '.css':
            command = new StylelintCommand(targetPaths);
            break;
    }
});
if (command !== undefined) {
    process.exit(command.execute());
}
