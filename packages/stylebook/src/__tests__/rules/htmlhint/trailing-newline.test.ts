import { describe, it } from 'vitest';
import trailingNewlineRule from '../../../rules/htmlhint/trailing-newline';
import { type AssertThat, assertThatHtmlhintRule } from '../../asserters';
import { assertHtmlhintProperties } from '../../asserts';

describe('TrailingNewlineRuleTest', () => {
    const assertThat: AssertThat = assertThatHtmlhintRule(trailingNewlineRule);

    it('Rule properties', () => assertHtmlhintProperties(trailingNewlineRule));

    it(
        'With final newline',
        () =>
            assertThat(
                `
                <!doctype html>
                <html>
                <body>hi</body>
                </html>

                `,
            ).hasNoError(),
    );

    it(
        'Without final newline',
        () =>
            assertThat(
                `
                <!doctype html>
                <html>
                <body>hi</body>
                </html>
                `,
            ).hasErrorMessages('4: Put a blank line at the end of the file.'),
    );
});
