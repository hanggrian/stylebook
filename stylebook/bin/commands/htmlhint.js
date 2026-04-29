import Command from './command.js';

/** CLI executor for <a href="https://htmlhint.com/">HTMLHint</b>. */
class HtmlhintCommand extends Command {
    constructor() {
        super('htmlhint', 'htmlhintrc');
    }

    getArguments(_, targetPaths) {
        return ['-c', this.configFile, ...targetPaths];
    }
}

export default HtmlhintCommand;
