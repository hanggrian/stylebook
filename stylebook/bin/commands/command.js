import { spawnSync } from 'node:child_process';
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

class Command {
    constructor(binary, configFile) {
        this.binary = binary;
        if (configFile === null) {
            return;
        }
        const localConfigFile = join(process.cwd(), `.${configFile}`);
        this.configFile =
            existsSync(localConfigFile)
                ? localConfigFile
                : join(
                    dirname(fileURLToPath(import.meta.url)),
                    `../../resources/${configFile}`,
                );
    }

    getArguments() {
        throw new Error(`Not implemented.`);
    }

    execute(targetPaths) {
        return spawnSync(
            this.binary,
            [...this.getArguments(), ...targetPaths],
            {
                stdio: 'inherit',
                shell: false,
            },
        ).status ?? 1;
    }
}

export default Command;
