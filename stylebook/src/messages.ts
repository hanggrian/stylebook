import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

class Messages {
    private readonly record: Record<string, string> =
        JSON.parse(
            readFileSync(
                join(
                    dirname(fileURLToPath(import.meta.url)),
                    '../resources/markdownlint_messages.json',
                ),
                'utf-8',
            ),
        ) as Record<string, string>;

    get(key: string, ...args: any[]): string {
        const value = this.record[key];
        if (!args) {
            return value;
        }
        return value.replace(
            /{(\d+)}/g,
            (match, number) =>
                args[number] !== 'undefined'
                    ? args[number]
                    : match,
        );
    }
}

export default new Messages();
