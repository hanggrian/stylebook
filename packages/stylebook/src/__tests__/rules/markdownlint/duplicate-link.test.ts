import { describe, it } from 'vitest';
import duplicateLinkRule from '../../../rules/markdownlint/duplicate-link';
import { type AssertThat, assertThatMarkdownlintRule } from '../../asserters';
import { assertMarkdownlintProperties } from '../../asserts';

describe('DuplicateLinkRuleTest', () => {
    const assertThat: AssertThat = assertThatMarkdownlintRule(duplicateLinkRule);

    it('Rule properties', () => assertMarkdownlintProperties(duplicateLinkRule));

    it(
        'Unique links',
        () =>
            assertThat(
                `
                [Google](https://www.google.com/)
                [Google 2](https://www.google.co.id/)
                `,
            ).hasNoError(),
    );

    it(
        'Duplicate links',
        () =>
            assertThat(
                `
                [Google](https://www.google.com/)
                [Google 2](https://www.google.com/)
                `,
            ).hasErrorMessages(
                '1: Declare inline link as variable.',
                '2: Declare inline link as variable.',
            ),
    );

    it(
        'Check inline URL',
        () =>
            assertThat(
                `
                - [Google](https://www.google.com/)

                | foo | bar |
                | --- | --- |
                | Image | [Google 2](https://www.google.com/) |
                `,
            ).hasErrorMessages(
                '1: Declare inline link as variable.',
                '5: Declare inline link as variable.',
            ),
    );
});
