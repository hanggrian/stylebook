import Command from './command.js';

/** CLI executor for <a href="https://prantlf.github.io/jsonlint/">JSON Lint</b>. */
class JsonlintCommand extends Command {
    constructor() {
        super('jsonlint', 'jsonlintrc.json');
    }

    getArguments(quiet, targetPaths) {
        const args = ['-f', this.configFile, ...targetPaths];
        return quiet
            ? [...args, '-q']
            : args;
    }
}

export default JsonlintCommand;
