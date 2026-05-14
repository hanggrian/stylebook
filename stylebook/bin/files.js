import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Returns local configuration file if it exists. Otherwise, use the default file in the resources
 * directory.
 *
 * @param {string} configFile
 * @returns {string}
 */
function getConfigFile(configFile) {
    const localConfigFile = join(process.cwd(), `.${configFile}`);
    return existsSync(localConfigFile) && statSync(localConfigFile).isFile()
        ? localConfigFile
        : join(
            dirname(fileURLToPath(import.meta.url)),
            `../resources/${configFile}`,
        );
}

export { getConfigFile };
