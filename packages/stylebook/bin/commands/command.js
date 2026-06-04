import { blue, u } from '../colors.js';
import { getConfigFile } from '../files.js';
import { spawnSync } from 'node:child_process';
import { relative } from 'node:path';

/** Abstract class for linter command. */
class Command {
    constructor(binary, configFile) {
        this.binary = binary;
        this.configFile =
            configFile !== undefined
                ? getConfigFile(configFile)
                : null;
    }

    /**
     * Returns true if package is installed.
     *
     * @returns {boolean}
     */
    isAvailable() {
        return spawnSync(
            process.platform === 'win32' ? 'where' : 'which',
            [this.binary],
            { stdio: 'ignore' },
        ).status === 0;
    }

    /**
     * Abstract method to define specific lint command for this linter.
     *
     * @param {boolean} quiet
     * @param {string[]} targetPaths
     * @returns {string[]}
     */
    getArguments(targetPaths, quiet) {
        throw new Error(`Not implemented: ${targetPaths}, ${quiet}`);
    }

    /**
     * Run lint command for the given collection of paths.
     *
     * @param {string} rootDir
     * @param {string[]} targetPaths
     * @param {boolean} quiet
     * @returns {number|Promise<number>}
     */
    execute(rootDir, targetPaths, quiet) {
        return spawnSync(
            this.binary,
            this.getArguments(targetPaths, quiet),
            {
                stdio: 'inherit',
                shell: false,
            },
        ).status ?? 1;
    }

    /**
     * Mask file path with visitable link.
     *
     * @param {string} rootDir folder where binary is invoked.
     * @param {string} filePath file to link to.
     * @param {number} line violation line number.
     * @param {number} col violation column number.
     * @returns {string}
     */
    static embedPath(rootDir, filePath, line, col) {
        return `\x1b]8;;file://${filePath}${
                line
                    ? (col ? `#L${line}:C${col}` : `#L${line}`)
                    : ''
            }` +
            `\x1b\\${u(blue(`${relative(rootDir, filePath)}:${line}:${col}`))}\x1b]8;;\x1b\\`;
    }
}

export default Command;
