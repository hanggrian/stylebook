#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// hijack validate flag as indicator to use package.json schema
let useNode = false;
const inputArgs =
    process.argv.slice(2).filter(arg =>
        arg === '--validate' || arg === '-V'
            ? !(useNode = true)
            : true,
    );

// use local config file if supplied
const resourcesPath = join(dirname(fileURLToPath(import.meta.url)), '../resources/');
const outputArgs = [
    ...inputArgs,
    '-k',
    '-n',
];
if (useNode) {
    outputArgs.push('-V', join(resourcesPath, 'package.json'));
    outputArgs.push('-f', join(resourcesPath, '.jsonlintrc.node.json'));
} else if (!inputArgs.some(arg => arg === '-f' || arg === '--config')) {
    outputArgs.push('-f', join(resourcesPath, '.jsonlintrc.json'));
}
process.exit(
    spawnSync(
        'jsonlint',
        outputArgs,
        {
            stdio: 'inherit',
            shell: true,
        },
    ).status ?? 1,
);
