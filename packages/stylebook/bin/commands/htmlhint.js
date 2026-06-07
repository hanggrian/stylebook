import Command from './command.js';
import htmlhint from 'htmlhint';
import { readFileSync } from 'node:fs';
import trailingNewlineRule from '../../dist/rules/htmlhint/trailing-newline.js';
import unnecessaryLeadingBlankLineRule
    from '../../dist/rules/htmlhint/unnecessary-leading-blank-line.js';

const { HTMLHint } = htmlhint;

/** CLI executor for <a href="https://htmlhint.com/">HTMLHint</a>. */
class HtmlhintCommand extends Command {
    constructor() {
        super('htmlhint', 'htmlhintrc');
    }

    isAvailable() {
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    execute(rootDir, targetPaths, quiet) {
        let hasErrors = false;
        const config = JSON.parse(readFileSync(this.configFile, 'utf-8'));
        HTMLHint.addRule(trailingNewlineRule);
        HTMLHint.addRule(unnecessaryLeadingBlankLineRule);
        for (const path of targetPaths) {
            const messages = HTMLHint.verify(readFileSync(path, 'utf-8'), config);
            if (messages.length <= 0) {
                continue;
            }
            hasErrors = true;
            messages.forEach(hint =>
                console.log(
                    `${Command.embedPath(rootDir, path, hint.line, hint.col)} ` +
                    `${hint.message} (${hint.rule.id})`,
                ),
            );
        }
        return hasErrors ? 1 : 0;
    }
}

export default HtmlhintCommand;
