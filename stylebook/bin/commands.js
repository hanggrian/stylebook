import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

class Command {
    constructor(binary, paths) {
        this.binary = binary;
        this.paths = paths;
    }

    execute() {
        return spawnSync(
            this.binary,
            this.paths,
            {
                stdio: 'inherit',
                shell: true,
            },
        ).status ?? 1;
    }
}

export class MarkdownlintCommand extends Command {
    constructor(targetPaths) {
        const markdownlintConfig = join(process.cwd(), '.markdownlint-cli2.json');
        super(
            'markdownlint-cli2',
            [
                '--config',
                existsSync(markdownlintConfig)
                    ? markdownlintConfig
                    : join(
                        dirname(fileURLToPath(import.meta.url)),
                        '../resources/markdownlint-cli2.json',
                    ),
                ...targetPaths,
            ],
        );
    }
}

export class JsonlintCommand extends Command {
    constructor(targetPaths) {
        const jsonlintConfig = join(process.cwd(), '.jsonlintrc.json');
        super(
            'jsonlint',
            [
                ...targetPaths,
                '-k',
                '-n',
                '-f',
                existsSync(jsonlintConfig)
                    ? jsonlintConfig
                    : join(
                        dirname(fileURLToPath(import.meta.url)),
                        '../resources/jsonlintrc.json',
                    ),
            ],
        );
    }
}

export class StylelintCommand extends Command {
    constructor(targetPaths) {
        super('stylelint', targetPaths);
    }
}
