import { describe, it } from 'vitest';
import olSpacesRule from '../../rules/ordered-list-spaces';
import { type AssertThat, assertThatRule } from '../asserters';
import assertProperties from '../asserts';

describe('OlSpacesTest', () => {
    const assertThat: AssertThat = assertThatRule(olSpacesRule);

    it('Rule properties', () => assertProperties(olSpacesRule));

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
                "1: Insert two spaces after list prefix.",
                "2: Insert one space after list prefix.",
                "3: Insert two spaces after list prefix.",
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
                "1: Insert two spaces after list prefix.",
                "2: Insert one space after list prefix.",
                "3: Insert two spaces after list prefix.",
            ),
    );
});
