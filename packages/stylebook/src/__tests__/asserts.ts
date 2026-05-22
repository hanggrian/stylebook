import type { Rule as HtmlhintRule } from 'htmlhint/dist/core/types';
import type { Rule as MarkdownlintRule } from 'markdownlint';
import { expect } from 'vitest';

function assertMarkdownlintProperties(module: MarkdownlintRule): void {
    const { names, description } = module;
    expect(names.length).toBe(1);
    const ruleName: string | undefined = names[0];
    expect(
        module.constructor.name
            .replace(/Rule$/, '')
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase(),
    ).toBe(ruleName);
    expect(description)
        .toBe(`https://hanggrian.github.io/stylebook/rules/markdown/#${ruleName}`);
}

function assertHtmlhintProperties(module: HtmlhintRule): void {
    const { id, description } = module;
    expect(
        module.constructor.name
            .replace(/Rule$/, '')
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase(),
    ).toBe(id);
    expect(description)
        .toBe(`https://hanggrian.github.io/stylebook/rules/html/#${id}`);
}

export { assertMarkdownlintProperties, assertHtmlhintProperties };
