import { describe, it } from 'vitest';
import deadLinkRule from '../../../rules/markdownlint/dead-link';
import { type AssertThat, assertThatMarkdownlintRule } from '../../asserters';
import { assertMarkdownlintProperties } from '../../asserts';

describe('DeadLinkRuleTest', () => {
    const assertThat: AssertThat = assertThatMarkdownlintRule(deadLinkRule);

    it('Rule properties', () => assertMarkdownlintProperties(deadLinkRule));

    it(
        'Live link',
        () => {
            deadLinkRule.checkUrls = () => [200];
            assertThat(
                `
                Visit [Google](https://www.google.com/)
                `,
            ).hasNoError();
        },
    );

    it(
        'Dead link',
        () => {
            deadLinkRule.checkUrls = () => [null];
            assertThat(
                `
                Visit [Google](https://www.googlea.com/)
                `,
            ).hasErrorMessages(
                "1: 'https://www.googlea.com/' cannot be reached.",
            );
        },
    );

    it(
        'Check inline URL',
        () => {
            deadLinkRule.checkUrls = () => [null, null];
            assertThat(
                `
                - [Google](https://www.googlea.com/)

                | foo | bar |
                | --- | --- |
                | Image | [Google](https://www.googlea.com/) |
                `,
            ).hasErrorMessages(
                "1: 'https://www.googlea.com/' cannot be reached.",
                "5: 'https://www.googlea.com/' cannot be reached.",
            );
        },
    );

    it(
        'Catch closing parenthesis',
        () => {
            deadLinkRule.checkUrls = () => [200];
            assertThat(
                `
                Visit [Wikipedia](https://en.wikipedia.org/wiki/Fine-tuning_(deep_learning))
                `,
            ).hasNoError();
        },
    );
});
