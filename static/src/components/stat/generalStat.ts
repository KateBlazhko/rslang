import Control from '../common/control';

// enum TextInner {
//   daily = 'Daily stats',
//   general = 'General stats'
// }

class GeneralStat extends Control {
  constructor(
    public parentNode: HTMLElement | null,
  ) {
    super(parentNode, 'div', 'stat__general');

    const buttonWrap = new Control(this.node, 'div', 'stat__button-wrap');
  }
}

export default GeneralStat;
