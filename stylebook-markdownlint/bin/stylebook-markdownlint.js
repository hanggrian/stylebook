#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const inputArgs = process.argv.slice(2);
process.exit(
    spawnSync(
        'markdownlint-cli2',
        inputArgs.some(arg => arg === '--config')
            ? inputArgs
            : [
                '--config',
                join(
                    dirname(fileURLToPath(import.meta.url)),
                    '../resources/.markdownlint-cli2.json',
                ),
                ...inputArgs,
            ],
        {
            stdio: 'inherit',
            shell: true,
        },
    ).status ?? 1,
);
