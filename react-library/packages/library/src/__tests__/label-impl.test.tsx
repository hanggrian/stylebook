import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {render} from '@testing-library/react';
import LabelImpl from '../label-impl';
import {SinonStub, assert, stub, restore} from 'sinon';

type MockedLabel = {
  getWidth: SinonStub<any[], number>,
  getHeight: SinonStub<any[], number>,
};

describe(
    'LabelImpl',
    () => {
      let label: MockedLabel;

      beforeEach(() => {
        label = {
          getWidth: stub(),
          getHeight: stub(),
        };
        render(<div></div>);
      });

      it(
          'test',
          () => {
            label.getWidth.returns(2);
            label.getHeight.returns(4);
            expect(new LabelImpl(label).getSize()).toBe(8);
            assert.calledOnce(label.getWidth);
            assert.calledOnce(label.getHeight);
          },
      );

      afterEach(() => restore());
    },
);
