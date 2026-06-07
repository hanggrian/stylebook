import Command from './command.js';
import { Config, Linter } from '@ibm/tekton-lint';

/**
 * CLI executor for <a href="https://github.com/IBM/tekton-lint/">tekton-lint</a>.
 */
class TektonLintCommand extends Command {
    constructor() {
        super('tekton-lint', 'tektonlintrc.yaml');
    }

    isAvailable() {
        return true;
    }

    async execute(rootDir, targetPaths, quiet) {
        let hasErrors = false;
        for (const problem of await Linter.run(new Config({
            _: targetPaths,
            config: this.configFile,
        }))) {
            if (quiet && problem.level !== 'error') {
                continue;
            }
            hasErrors = true;
            console.log(
                `${Command.embedPath(
                    rootDir,
                    problem.path,
                    problem.loc?.starLine ?? 1,
                    problem.loc?.startColumn ?? 1,
                )} ${problem.message} (${problem.rule})`,
            );
        }
        return hasErrors ? 1 : 0;
    }
}

export default TektonLintCommand;
