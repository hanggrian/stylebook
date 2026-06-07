import Command from './command.js';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import validate from 'asl-validator';

/**
 * CLI executor for <a href="https://github.com/ChristopheBougere/asl-validator/">asl-validator</a>.
 */
class AslValidatorCommand extends Command {
    constructor() {
        super('asl-validator');
    }

    isAvailable() {
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    execute(rootDir, targetPaths, quiet) {
        let hasErrors = false;
        for (const path of targetPaths) {
            const source = readFileSync(path, 'utf-8');
            const extension = path.substring(path.lastIndexOf('.'));
            const definition =
                extension === '.yaml' || extension === '.yml'
                    ? parse(source)
                    : JSON.parse(source);
            const errors = validate(definition);
            if (!errors.length) {
                continue;
            }
            hasErrors = true;
            for (const error of errors) {
                console.log(
                    `${Command.embedPath(rootDir, path, 1, 1)} ` +
                    `${error['Message'] ?? ''} (${error['Error code'] ?? ''})`,
                );
            }
        }
        return hasErrors ? 1 : 0;
    }
}

export default AslValidatorCommand;
