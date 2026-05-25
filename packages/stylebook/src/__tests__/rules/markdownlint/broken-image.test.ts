import { describe, expect, it } from 'vitest';
import brokenImageRule from '../../../rules/markdownlint/broken-image';
import { type AssertThat, assertThatMarkdownlintRule } from '../../asserters';
import { assertMarkdownlintProperties } from '../../asserts';

describe('BrokenImageRuleTest', () => {
    const assertThat: AssertThat = assertThatMarkdownlintRule(brokenImageRule);

    it('Rule properties', () => assertMarkdownlintProperties(brokenImageRule));

    it(
        'Good image',
        () => {
            brokenImageRule.checkUrls = () => [{ status: 200, contentType: 'image/svg+xml' }];
            assertThat(
                `
                ![Logo](https://github.com/hanggrian/stylebook/raw/assets/logo.svg)
                `,
            ).hasNoError();
        },
    );

    it(
        'Bad image',
        () => {
            brokenImageRule.checkUrls = () => [
                { status: null, contentType: null },
                { status: 200, contentType: 'text/html' },
            ];
            assertThat(
                `
                ![Logo](https://www.logo.svg)
                ![Google](https://google.com/)
                `,
            ).hasErrorMessages(
                "1: 'https://www.logo.svg' is unreachable.",
                "2: 'https://google.com/' is not a valid image.",
            );
        },
    );

    it(
        'Check inline URL',
        () => {
            brokenImageRule.checkUrls = () => [
                { status: null, contentType: null },
                { status: null, contentType: null },
            ];
            assertThat(
                `
                - ![Logo](https://www.logo.svg)

                | foo | bar |
                | --- | --- |
                | Image | ![Logo](https://www.logo.svg) |
                `,
            ).hasErrorMessages(
                "1: 'https://www.logo.svg' is unreachable.",
                "5: 'https://www.logo.svg' is unreachable.",
            );
        },
    );

    it(
        'Catch closing parenthesis',
        () => {
            brokenImageRule.checkUrls = () => [{ status: 200, contentType: 'image/svg+xml' }];
            assertThat(
                `
                ![Unsplash](https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww&s=))
                `,
            ).hasNoError();
        },
    );
});
