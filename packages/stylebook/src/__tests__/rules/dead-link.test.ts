import { describe, it } from 'vitest';
import deadLinkRule from '../../rules/dead-link';
import { type AssertThat, assertThatRule } from '../asserters';
import assertProperties from '../asserts';

describe('DeadLinkRuleTest', () => {
    const assertThat: AssertThat = assertThatRule(deadLinkRule);

    it('Rule properties', () => assertProperties(deadLinkRule));

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
});
