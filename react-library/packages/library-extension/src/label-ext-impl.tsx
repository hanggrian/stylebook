import LabelImpl, {Label} from 'library/label-impl';

export type LabelExt = Label & {
  getX: () => number,
  getY: () => number,
}

class LabelExtImpl extends LabelImpl {
  declare label: LabelExt;

  constructor(label: LabelExt) {
    super(label);
  }

  getPosition(): string {
    return `(${this.label.getX()},${this.label.getY()})`;
  }
}

export default LabelExtImpl;
