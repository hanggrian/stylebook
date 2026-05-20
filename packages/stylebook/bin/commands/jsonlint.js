import Command from './command.js';
import { parse } from '@prantlf/jsonlint';
import { readFileSync } from 'node:fs';

/** CLI executor for <a href="https://prantlf.github.io/jsonlint/">JSON Lint</a>. */
class JsonlintCommand extends Command {
    constructor() {
        super('jsonlint', 'jsonlintrc.json');
    }

    execute(_, targetPaths) {
        let hasErrors = false;
        const config = JSON.parse(readFileSync(this.configFile, 'UTF-8'));
        const parserOptions = {
            mode: config.mode,
            ignoreBOM: config.bom,
            ignoreComments: config.comments,
            ignoreTrailingCommas: config.trailingCommas || config.trimTrailingCommas,
            allowSingleQuotedStrings: config.singleQuotedStrings,
            allowDuplicateObjectKeys: config.duplicateKeys,
            ignoreProtoKey: config.ignoreProtoKey,
            ignorePrototypeKeys: config.ignorePrototypeKeys,
        };
        for (const targetPath of targetPaths) {
            try {
                const source = readFileSync(targetPath, 'UTF-8');
                const parsed = parse(source, parserOptions);
                let output = JSON.stringify(parsed, null, config.indent);
                const hasTrailingNewline = !source.split(/\r?\n/).at(-1);
                if (config.trailingNewline === true ||
                    (config.trailingNewline !== false && hasTrailingNewline)) {
                    output += config.forceCrlf === true ? '\r\n' : '\n';
                }
                if (source === output) {
                    continue;
                }
                const reports = JsonlintCommand.getReports(source, output);
                for (const { line, column, reason } of reports) {
                    console.log(`${Command.embedPath(targetPath, line, column)}: ${reason}`);
                }
                hasErrors = true;
            } catch (error) {
                hasErrors = true;
                const { location } = error;
                const { line, column } = location.start;
                console.log(`${Command.embedPath(targetPath, line, column)}: ${error.reason}`);
            }
        }
        return hasErrors ? 1 : 0;
    }

    static getReports(source, output) {
        const sourceLines = source.split(/\r?\n/);
        const outputLines = output.split(/\r?\n/);
        const reports = [];
        let sourceIndex = 0;
        let outputIndex = 0;
        while (sourceIndex < sourceLines.length &&
        outputIndex < outputLines.length) {
            const sourceLine = sourceLines[sourceIndex];
            const outputLine = outputLines[outputIndex];
            if (sourceLine === outputLine) {
                ++sourceIndex;
                ++outputIndex;
                continue;
            }
            const trimmedSource = sourceLine.trim();
            let reason = 'Formatted output differs';
            if (!trimmedSource) {
                reason = 'No empty line';
            } else if (/\/\/|\/\*/.test(sourceLine)) {
                reason = 'No comment';
            } else if (trimmedSource.endsWith(',') &&
                !outputLine.trim().endsWith(',')) {
                reason = 'No trailing comma';
            }
            if (sourceLines[sourceIndex + 1] === outputLine) {
                reports.push({ line: sourceIndex + 1, column: 1, reason });
                ++sourceIndex;
                continue;
            }
            if (outputLines[outputIndex + 1] === sourceLine) {
                reports.push({ line: sourceIndex + 1, column: 1, reason });
                ++outputIndex;
                continue;
            }
            reports.push({ line: sourceIndex + 1, column: 1, reason });
            ++sourceIndex;
            ++outputIndex;
        }
        while (sourceIndex < sourceLines.length) {
            reports.push({ line: sourceIndex + 1, column: 1, reason: 'Formatted output differs' });
            ++sourceIndex;
        }
        return reports;
    }
}

export default JsonlintCommand;
