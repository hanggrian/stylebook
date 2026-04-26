import Command from './command.js';

class StylelintCommand extends Command {
    constructor() {
        super('stylelint', null);
    }

    getArguments() {
        return [];
    }
}

export default StylelintCommand;
