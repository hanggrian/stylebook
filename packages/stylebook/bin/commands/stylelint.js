import Command from './command.js';

/** CLI executor for <a href="https://stylelint.io/">Stylelint</a>. */
class StylelintCommand extends Command {
    constructor() {
        super('stylelint');
    }

    getArguments(quiet, targetPaths) {
        return quiet
            ? [...targetPaths, '--quiet']
            : targetPaths;
    }
}

export default StylelintCommand;
