import { describe, it } from 'vitest';
import unnecessaryLeadingBlankLineRule
    from '../../../rules/htmlhint/unnecessary-leading-blank-line';
import { type AssertThat, assertThatHtmlhintRule } from '../../asserters';
import { assertHtmlhintProperties } from '../../asserts';

describe('UnnecessaryLeadingBlankLineRuleTest', () => {
    const assertThat: AssertThat = assertThatHtmlhintRule(unnecessaryLeadingBlankLineRule);

    it('Rule properties', () => assertHtmlhintProperties(unnecessaryLeadingBlankLineRule));

    it(
        'Without leading blank line',
        () =>
            assertThat(
                `
                <!doctype html>
                <html>
                <body>hi</body>
                </html>
                `
            ).hasNoError(),
    );

    it(
        'With leading blank line',
        () =>
            assertThat(
                `

                <!doctype html>
                <html>
                <body>hi</body>
                </html>
                `
            ).hasErrorMessages('1: Remove blank line at the beginning.'),
    );
});
