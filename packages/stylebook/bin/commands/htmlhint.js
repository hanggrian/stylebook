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

    execute(_, targetPaths) {
        let hasErrors = false;
        const config = JSON.parse(readFileSync(this.configFile, 'UTF-8'));
        HTMLHint.addRule(trailingNewlineRule);
        HTMLHint.addRule(unnecessaryLeadingBlankLineRule);
        for (const targetPath of targetPaths) {
            const messages = HTMLHint.verify(readFileSync(targetPath, 'UTF-8'), config);
            if (messages.length <= 0) {
                continue;
            }
            hasErrors = true;
            messages.forEach(hint =>
                console.log(
                    `${Command.embedPath(targetPath, hint.line, hint.col)}: ` +
                    `${hint.message} (${hint.rule.id})`,
                ),
            );
        }
        return hasErrors ? 1 : 0;
    }
}

export default HtmlhintCommand;
