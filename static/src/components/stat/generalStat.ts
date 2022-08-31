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
    super(parentNode, 'div', 'stat__general general');

    const chartNewWords = new Control(this.node, 'div', 'general__chart-wrap');
    const chartProgress = new Control(this.node, 'div', 'general__chart-wrap');

  }
}

export default GeneralStat;
