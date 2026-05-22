import type { HTMLParser, Reporter } from 'htmlhint/dist/core/core';
import type { Rule } from 'htmlhint/dist/core/types';

abstract class StylebookHtmlhintRule implements Rule {
    readonly id: string;
    readonly description: string;
    readonly link: string;

    protected constructor(id: string) {
        this.id = id;
        this.description = `https://hanggrian.github.io/stylebook/rules/html/#${id}`;
        this.link = this.description;
    }

    init(parser: HTMLParser, reporter: Reporter, options: unknown): void {
        this.visit(parser, reporter, options);
    }

    abstract visit(parser: HTMLParser, reporter: Reporter, options: unknown): void;
}

export default StylebookHtmlhintRule;
