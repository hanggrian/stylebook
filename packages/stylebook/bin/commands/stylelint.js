import Command from './command.js';
import stylelint from 'stylelint';

/** CLI executor for <a href="https://stylelint.io/">Stylelint</a>. */
class StylelintCommand extends Command {
    constructor() {
        super('stylelint');
    }

    isAvailable() {
        return true;
    }

    async execute(rootDir, targetPaths, quiet) {
        const linterResult =
            await stylelint.lint({
                files: targetPaths,
                quiet: quiet,
            });
        for (const lintResult of linterResult.results) {
            if (!lintResult.warnings.length) {
                continue;
            }
            for (const warning of lintResult.warnings) {
                console.log(
                    `${Command.embedPath(
                        rootDir,
                        lintResult.source,
                        warning.line,
                        warning.column,
                    )} ${warning.text}`,
                );
            }
        }
        return linterResult.errored ? 1 : 0;
    }
}

export default StylelintCommand;
