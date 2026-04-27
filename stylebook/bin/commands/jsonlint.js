import Command from './command.js';

/** CLI executor for <a href="https://prantlf.github.io/jsonlint/">JSON Lint</b>. */
class JsonlintCommand extends Command {
    constructor() {
        super('jsonlint', 'jsonlintrc.json');
    }

    getArguments(silent) {
        const args = ['-k', '-n', '-f', this.configFile];
        return silent
            ? ['-q', ...args]
            : args;
    }
}

export default JsonlintCommand;
