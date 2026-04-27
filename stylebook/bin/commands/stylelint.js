import Command from './command.js';

/** CLI executor for <a href="https://stylelint.io/">Stylelint</b>. */
class StylelintCommand extends Command {
    constructor() {
        super('stylelint', null);
    }

    getArguments(silent) {
        return silent
            ? ['--quiet']
            : [];
    }
}

export default StylelintCommand;
