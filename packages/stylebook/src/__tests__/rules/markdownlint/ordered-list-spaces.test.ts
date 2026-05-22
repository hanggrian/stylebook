import { describe, it } from 'vitest';
import orderedListSpacesRule from '../../../rules/markdownlint/ordered-list-spaces';
import { type AssertThat, assertThatMarkdownlintRule } from '../../asserters';
import { assertMarkdownlintProperties } from '../../asserts';

describe('OrderedListSpacesRuleTest', () => {
    const assertThat: AssertThat = assertThatMarkdownlintRule(orderedListSpacesRule);

    it('Rule properties', () => assertMarkdownlintProperties(orderedListSpacesRule));

    it(
        'Correct format',
        () =>
            assertThat(
                `
                1.  Foo
                22. Bar
                333.  Baz
                `,
            ).hasNoError(),
    );

    it(
        'Incorrect format',
        () =>
            assertThat(
                `
                1. Foo
                22.  Bar
                333. Baz
                `,
            ).hasErrorMessages(
                '1: Insert two spaces after list prefix.',
                '2: Insert one space after list prefix.',
                '3: Insert two spaces after list prefix.',
            ),
    );

    it(
        'Target nested list',
        () =>
            assertThat(
                `
                1. Foo
                   22.  Bar
                333. Baz
                `,
            ).hasErrorMessages(
                '1: Insert two spaces after list prefix.',
                '2: Insert one space after list prefix.',
                '3: Insert two spaces after list prefix.',
            ),
    );
});
