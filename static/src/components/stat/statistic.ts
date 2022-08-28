import Control from '../common/control';
import DailyStat from './dailyStat';
import GeneralStat from './generalStat';

enum TextInner {
  daily = 'Daily stats',
  general = 'General stats'
}

class StatisticPage extends Control {
  private dailyStat: DailyStat;

  private generalStat: GeneralStat;

  private currentStat: DailyStat | GeneralStat | null = null;

  private statWrap: Control;

  constructor(
    public parentNode: HTMLElement | null,
    public className: string,
  ) {
    super(parentNode, 'div', className);

    const buttonWrap = new Control(this.node, 'div', 'stat__button-wrap');
    this.statWrap = new Control(this.node, 'div', 'stat__inner');

    this.dailyStat = new DailyStat(null);
    this.generalStat = new GeneralStat(null);
    this.currentStat = null;

    const buttonsDaily = new Control(buttonWrap.node, 'div', 'stat__button', TextInner.daily);
    buttonsDaily.node.classList.add('active')

    const buttonsGeneral = new Control(buttonWrap.node, 'div', 'stat__button', TextInner.general);

    buttonsDaily.node.onclick = () => {
      this.switchStat(this.dailyStat);
      buttonsDaily.node.classList.add('active')
      buttonsGeneral.node.classList.remove('active')

    };

    buttonsGeneral.node.onclick = () => {
      this.switchStat(this.generalStat);
      buttonsDaily.node.classList.remove('active')
      buttonsGeneral.node.classList.add('active')
    };

    this.init()
  }

  private init() {
    this.currentStat = this.dailyStat;
    this.statWrap.node.append(this.currentStat.node);
  }

  private switchStat(view: DailyStat | GeneralStat) {
    if (this.currentStat) this.currentStat.destroy();

    this.currentStat = view;
    this.statWrap.node.append(this.currentStat.node);
  }
}

export default StatisticPage;
