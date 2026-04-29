import Command from './command.js';

/**
 * CLI executor for <a href="https://github.com/DavidAnson/markdownlint-cli2">markdownlint-cli2</b>.
 */
class MarkdownlintCommand extends Command {
    constructor() {
        super('markdownlint-cli2', 'markdownlint-cli2.json');
    }

    getArguments(quiet, targetPaths) {
        const args = ['--config', this.configFile, ...targetPaths];
        return quiet
            ? [...args, '--quiet']
            : args;
    }
}

export default MarkdownlintCommand;
