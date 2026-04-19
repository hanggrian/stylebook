import { describe, it } from 'vitest';
import unnecessaryBlankLineInListRule from '../../rules/unnecessary-blank-line-in-list';
import { type AssertThat, assertThatRule } from '../asserters';
import assertProperties from '../asserts';

describe('UnnecessaryBlankLineInListTest', () => {
    const assertThat: AssertThat = assertThatRule(unnecessaryBlankLineInListRule);

    it('Rule properties', () => assertProperties(unnecessaryBlankLineInListRule));

    it(
        'Correct lists',
        () =>
            assertThat(
                `
                - Foo
                - Bar

                1. Foo
                1. Bar
                `,
            ).hasNoError(),
    );

    it(
        'Incorrect lists',
        () =>
            assertThat(
                `
                - Lorem

                - Ipsum

                1. Foo

                1. Bar
                `,
            ).hasErrorMessages(
                "2: Remove empty line between list item.",
                "6: Remove empty line between list item.",
            ),
    );

    it(
        'Allow blank line with content',
        () =>
            assertThat(
                `
                1. Lorem

                   continuation
                1. Ipsum
                `,
            ).hasNoError(),
    );

    it(
        'Allow blank line on different list',
        () =>
            assertThat(
                `
                1. Lorem
                1. Ipsum

                - Lorem
                - Ipsum

                1. Lorem
                1. Ipsum
                `,
            ).hasNoError(),
    );

    it(
        'Allow blank line between list',
        () =>
            assertThat(
                `
                Lorem ipsum

                - Lorem
                - Ipsum

                Lorem ipsum
                `,
            ).hasNoError(),
    );

    it(
        'Target nested list',
        () =>
            assertThat(
                `
                - Lorem
                  - Nested A

                  - Nested B
                `,
            ).hasErrorMessages(
                "3: Remove empty line between list item.",
            ),
    );
});
