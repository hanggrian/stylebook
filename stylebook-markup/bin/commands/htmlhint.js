import Command from './command.js';

class HtmlhintCommand extends Command {
    constructor() {
        super('htmlhint', 'htmlhintrc');
    }

    getArguments() {
        return ['-c', this.configFile];
    }
}

export default HtmlhintCommand;
