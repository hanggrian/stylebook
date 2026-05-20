import { spawnSync } from 'node:child_process';
import { getConfigFile } from '../files.js';

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
     * @param {path[]} targetPaths
     * @returns {string[]}
     */
    getArguments(quiet, targetPaths) {
        throw new Error(`Not implemented: ${quiet}, ${targetPaths}`);
    }

    /**
     * Run lint command for the given collection of paths.
     *
     * @param {boolean} quiet
     * @param {path[]} targetPaths
     * @returns {number}
     */
    execute(quiet, targetPaths) {
        return spawnSync(
            this.binary,
            this.getArguments(quiet, targetPaths),
            {
                stdio: 'inherit',
                shell: false,
            },
        ).status ?? 1;
    }

    /**
     * Mask file path with visitable link.
     *
     * @param filePath file to link to.
     * @param line violation line number.
     * @param col violation column number.
     * @returns {string}
     */
    static embedPath(filePath, line, col) {
        return `\x1b]8;;file://${filePath}${
                line
                    ? (col ? `#L${line}:C${col}` : `#L${line}`)
                    : ''
            }` +
            `\x1b\\${filePath}:${line}:${col}\x1b]8;;\x1b\\`;
    }
}

export default Command;
