import Command from './command.js';
import {
    ParseLockfile,
    ValidateHost,
    ValidateHttps,
    ValidateIntegrity,
    ValidatePackageNames,
    ValidateScheme,
} from 'lockfile-lint-api';
import { basename } from 'node:path';

/**
 * CLI executor for <a href="https://https://github.com/lirantal/lockfile-lint/">lockfile-lint</a>.
 */
class LockfileLintCommand extends Command {
    constructor() {
        super('lockfile-lint');
    }

    isAvailable() {
        return true;
    }

    execute(_, targetPaths) {
        let hasErrors = false;
        for (const path of targetPaths) {
            const hosts =
                basename(path) === 'yarn.lock'
                    ? LockfileLintCommand.YARN_HOST
                    : LockfileLintCommand.NPM_HOST;
            const parser = new ParseLockfile({ lockfilePath: path });
            const lockfile = parser.parseSync();
            const validators = [
                new ValidateHttps({ packages: lockfile.object }),
                new ValidateHost({ packages: lockfile.object }),
                new ValidatePackageNames({ packages: lockfile.object }),
                new ValidateScheme({ packages: lockfile.object }),
                new ValidateIntegrity({ packages: lockfile.object }),
            ];
            for (const validator of validators) {
                try {
                    let result;
                    if (validator instanceof ValidateHost) {
                        result = validator.validate(hosts);
                    } else if (validator instanceof ValidateScheme) {
                        result = validator.validate(LockfileLintCommand.HTTPS_SCHEME);
                    } else {
                        result = validator.validate();
                    }
                    if (result.type === 'error') {
                        for (const error of result.errors) {
                            console.log(error.message);
                        }
                        hasErrors = true;
                    }
                } catch (error) {
                    hasErrors = true;
                }
            }
        }
        return hasErrors ? 1 : 0;
    }

    static HTTPS_SCHEME = ['https:'];
    static NPM_HOST = ['npm'];
    static YARN_HOST = ['yarn'];
}

export default LockfileLintCommand;
