import Command from './command.js';

class MarkdownlintCommand extends Command {
    constructor() {
        super('markdownlint-cli2', 'markdownlint-cli2.json');
    }

    getArguments() {
        return ['--config', this.configFile];
    }
}

export default MarkdownlintCommand;
