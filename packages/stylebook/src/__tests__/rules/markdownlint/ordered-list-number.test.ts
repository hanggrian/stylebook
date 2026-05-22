import { describe, it } from 'vitest';
import orderedListNumberRule from '../../../rules/markdownlint/ordered-list-number';
import { type AssertThat, assertThatMarkdownlintRule } from '../../asserters';
import { assertMarkdownlintProperties } from '../../asserts';

describe('OrderedListNumberRuleTest', () => {
    const assertThat: AssertThat = assertThatMarkdownlintRule(orderedListNumberRule);

    it('Rule properties', () => assertMarkdownlintProperties(orderedListNumberRule));

    it('Passes single item', () => assertThat('1. Lorem').hasNoError());

    it(
        'Correct format',
        () =>
            assertThat(
                `
                1. Foo
                1. Bar
                1. Baz
                `,
            ).hasNoError(),
    );

    it(
        'Incorrect format',
        () =>
            assertThat(
                `
                1. Foo
                2. Bar
                3. Baz
                `,
            ).hasErrorMessages(
                "2: Replace list number with '1'.",
                "3: Replace list number with '1'.",
            ),
    );

    it(
        'Resets after non-list line',
        () =>
            assertThat(
                `
                1. Foo

                2. Bar
                paragraph
                3. Baz
                `,
            ).hasNoError(),
    );

    it('Allow arbitrary starting number', () => assertThat('5. Lorem').hasNoError());

    it(
        'Allow decrementing numbers',
        () =>
            assertThat(
                `
                3. Foo
                2. Bar
                1. Baz
                `,
            ).hasNoError(),
    );

    it(
        'Target independent nested list',
        () =>
            assertThat(
                `
            1. Foo
               1. Bar 1
               2. Bar 2
            `,
            ).hasErrorMessages("3: Replace list number with '1'."),
    );

    it(
        'Skip cross indent levels',
        () =>
            assertThat(
                `
                1. Foo 1
                   2. Bar
                1. Foo 2
                `,
            ).hasNoError(),
    );
});
