import Command from './command.js';
import { readFileSync } from 'node:fs';
import { validate } from '@probelabs/maid';

/** CLI executor for <a href="https://probelabs.com/maid/">Maid</a>. */
class MaidCommand extends Command {
    constructor() {
        super('maid');
    }

    isAvailable() {
        return true;
    }

    execute(_, targetPaths) {
        let hasErrors = false;
        for (const targetPath of targetPaths) {
            const source = readFileSync(targetPath, 'utf-8');
            try {
                const res = validate(source);
                const errors = res.errors || [];
                if (!errors.length) {
                    continue;
                }
                hasErrors = true;
                for (const e of errors) {
                    let code = '';
                    if (e.code) {
                        code = ` (${e.code})`;
                    } else if (e.message) {
                        code = ` (${e.message})`;
                    }
                    console.log(
                        `${Command.embedPath(
                            targetPath,
                            e.line ?? 1,
                            e.column ?? 1,
                        )}: ${e.message ?? JSON.stringify(e)}${code}`,
                    );
                }
            } catch (err) {
                hasErrors = true;
                console.log(
                    `${Command.embedPath(targetPath, 1, 1)}: ${err?.message ?? String(err)}`,
                );
            }
        }
        return hasErrors ? 1 : 0;
    }
}

export default MaidCommand;
