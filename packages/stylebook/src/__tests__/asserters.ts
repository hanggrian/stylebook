import type StylebookMarkdownlintRule from '../rules/markdownlint/stylebook-markdown-rule';
import type { RuleParams } from 'markdownlint';
import { expect } from 'vitest';
import StylebookHtmlhintRule from "../rules/htmlhint/stylebook-htmlhint-rule";

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

function assertThatMarkdownlintRule(rule: StylebookMarkdownlintRule): AssertThat {
    return (code: string) => {
        const errors: Map<number, string> = new Map();
        const lines: string[] = [];
        code
            .replace(/^\n/, '')
            .replace(/\n[ \t]*$/, '')
            .split('\n')
            .forEach(s => lines.push(s.replace('                ', '')));
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

function assertThatHtmlhintRule(rule: StylebookHtmlhintRule): AssertThat {
    return (code: string) => {
        const errors: string[] = [];
        const lines: string[] = [];
        code
            .replace(/^\n/, '')
            .replace(/\n[ \t]*$/, '')
            .split('\n')
            .forEach(s => lines.push(s.replace('                ', '')));
        rule.visit(
            {
                addListener: (event: string, callback: () => void) => {
                    if (event === 'end') {
                        callback();
                    }
                },
            } as any,
            {
                warn: (message: string, lineNumber: number) =>
                    errors.push(`${lineNumber}: ${message}`),
                lines,
            } as any,
            {},
        );
        return new Asserter(
            new Map(
                errors.map(e => {
                    const [lineNumber, message] = e.split(': ');
                    return [parseInt(lineNumber), message];
                }),
            ),
        );
    };
}

export { assertThatMarkdownlintRule, assertThatHtmlhintRule, AssertThat };
