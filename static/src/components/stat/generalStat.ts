import Control from '../common/control';
import Logging from '../login/Logging';

// enum TextInner {
//   daily = 'Daily stats',
//   general = 'General stats'
// }

class GeneralStat extends Control {
  constructor(
    public parentNode: HTMLElement | null,
    private login: Logging
  ) {
    super(parentNode, 'div', 'stat__general');

    const buttonWrap = new Control(this.node, 'div', 'stat__button-wrap');
  }
}

export default GeneralStat;
