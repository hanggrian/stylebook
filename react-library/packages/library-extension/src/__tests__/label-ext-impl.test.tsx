import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {render} from '@testing-library/react';
import LabelExtImpl from '../label-ext-impl';
import {SinonStub, assert, stub, restore} from 'sinon';

type MockedLabelExt = {
  getX: SinonStub<any[], number>,
  getY: SinonStub<any[], number>,
  getWidth: SinonStub<any[], number>,
  getHeight: SinonStub<any[], number>,
};

describe(
    'LabelExtImpl',
    () => {
      let label: MockedLabelExt;

      beforeEach(() => {
        label = {
          getX: stub(),
          getY: stub(),
          getWidth: stub(),
          getHeight: stub(),
        };
        render(<div></div>);
      });

      it(
          'test',
          () => {
            label.getX.returns(0);
            label.getY.returns(1);
            expect(new LabelExtImpl(label).getPosition()).toBe('(0,1)');
            assert.calledOnce(label.getX);
            assert.calledOnce(label.getY);
          },
      );

      afterEach(() => restore());
    },
);
