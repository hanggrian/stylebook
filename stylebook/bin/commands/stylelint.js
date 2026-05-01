import Command from './command.js';

/** CLI executor for <a href="https://stylelint.io/">Stylelint</b>. */
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
