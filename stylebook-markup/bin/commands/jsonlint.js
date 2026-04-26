import Command from './command.js';

class JsonlintCommand extends Command {
    constructor() {
        super('jsonlint', 'jsonlintrc.json');
    }

    getArguments() {
        return ['-k', '-n', '-f', this.configFile];
    }
}

export default JsonlintCommand;
