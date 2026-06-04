import Command from './command.js';
import stylebookMarkdown from '@hanggrian/stylebook';
import { lint } from 'markdownlint/sync';
import markdownIt from 'markdown-it';
import { readFileSync } from 'node:fs';

/**
 * CLI executor for <a href="https://github.com/DavidAnson/markdownlint/">markdownlint</a>.
 */
class MarkdownlintCommand extends Command {
    constructor() {
        super('markdownlint', 'markdownlint.json');
    }

    isAvailable() {
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    execute(rootDir, targetPaths, quiet) {
        let hasErrors = false;
        for (const [filePath, errors] of Object.entries(
            lint({
                config: JSON.parse(readFileSync(this.configFile, 'UTF-8')),
                customRules: stylebookMarkdown,
                markdownItFactory: () => markdownIt({ html: true }),
                files: targetPaths,
            }),
        )) {
            if (!errors.length) {
                continue;
            }
            hasErrors = true;
            for (const error of errors) {
                console.log(
                    `${Command.embedPath(
                        rootDir,
                        filePath,
                        error.lineNumber,
                        error.errorRange?.[0] ?? 1,
                    )} ${error.errorDetail} (${error.ruleNames.at(-1)})`,
                );
            }
        }
        return hasErrors ? 1 : 0;
    }
}

export default MarkdownlintCommand;
