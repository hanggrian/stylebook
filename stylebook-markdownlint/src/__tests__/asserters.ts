import type StylebookRule from '../rules/stylebook-rule';
import type { RuleParams } from "markdownlint";
import { expect } from 'vitest';

class Asserter {
    private readonly errors: string[] = [];

    constructor(errors: Map<number, string>) {
        errors.forEach((detail, lineNumber) => this.errors.push(`${lineNumber}: ${detail}`));
    }

    hasNoError(): void {
        expect(this.errors).toHaveLength(0);
    }

    hasErrorMessages(...messages: string[]): void {
        expect(messages).toEqual(this.errors);
    }
}

type AssertThat = (code: string) => Asserter;

function assertThatRule(rule: StylebookRule): AssertThat {
    return (code: string) => {
        const errors: Map<number, string> = new Map();
        const lines: string[] = [];
        code.trim().split('\n').forEach(s => lines.push(s.replace('                ', '')));
        rule['function'](
            {
                name: 'test',
                lines: lines,
                frontMatterLines: [],
                parsers: {} as RuleParams['parsers'],
                config: {},
                version: '',
            },
            ({ lineNumber, detail }) =>
                errors.set(
                    lineNumber,
                    detail !== undefined
                        ? detail
                        : '',
                ),
        );
        return new Asserter(errors);
    };
}

export { assertThatRule, AssertThat };
