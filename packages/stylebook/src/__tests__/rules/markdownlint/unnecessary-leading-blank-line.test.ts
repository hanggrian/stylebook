import { describe, it } from 'vitest';
import unnecessaryLeadingBlankLineRule
    from '../../../rules/markdownlint/unnecessary-leading-blank-line';
import { type AssertThat, assertThatMarkdownlintRule } from '../../asserters';
import { assertMarkdownlintProperties } from '../../asserts';

describe('UnnecessaryLeadingBlankLineRuleTest', () => {
    const assertThat: AssertThat = assertThatMarkdownlintRule(unnecessaryLeadingBlankLineRule);

    it('Rule properties', () => assertMarkdownlintProperties(unnecessaryLeadingBlankLineRule));

    it(
        'Without leading blank line',
        () =>
            assertThat(
                `
                # Foo

                Bar
                `,
            ).hasNoError(),
    );

    it(
        'With leading blank line',
        () =>
            assertThat(
                `

                # Foo

                Bar
                `,
            ).hasErrorMessages(
                '1: Remove blank line at the beginning.',
            ),
    );

    it(
        'Horizontal rule first line',
        () =>
            assertThat(
                `
                ---
                title: Comment
                weight: 10
                bookFlatSection: true
                bookIcon: comment
                ---
                `,
            ).hasNoError(),
    );
});
