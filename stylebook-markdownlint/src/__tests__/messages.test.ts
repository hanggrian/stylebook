import { describe, expect, it } from 'vitest';
import Messages from '../messages';

describe('MessagesTest', () => {
    it(
        'get',
        () =>
            expect(Messages.get('ordered.list.number', 0))
                .toBe("Replace ordered list number with '0'."),
    );
});
