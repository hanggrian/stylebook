import type { Rule } from 'markdownlint';
import { expect } from 'vitest';

function assertProperties(module: Rule): void {
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
        .toBe(`https://hanggrian.github.io/stylebook/rules/#${ruleName}`);
}

export default assertProperties;
