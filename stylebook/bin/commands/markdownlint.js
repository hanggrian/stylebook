import Command from './command.js';

/**
 * CLI executor for <a href="https://github.com/DavidAnson/markdownlint-cli2">markdownlint-cli2</b>.
 */
class MarkdownlintCommand extends Command {
    constructor() {
        super('markdownlint-cli2', 'markdownlint-cli2.json');
    }

    getArguments(silent) {
        const args = ['--config', this.configFile];
        return silent
            ? ['--quiet', ...args]
            : args;
    }
}

export default MarkdownlintCommand;
