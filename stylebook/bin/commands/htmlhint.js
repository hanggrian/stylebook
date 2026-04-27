import Command from './command.js';

/** CLI executor for <a href="https://htmlhint.com/">HTMLHint</b>. */
class HtmlhintCommand extends Command {
    constructor() {
        super('htmlhint', 'htmlhintrc');
    }

    getArguments(_) {
        return ['-c', this.configFile];
    }
}

export default HtmlhintCommand;
