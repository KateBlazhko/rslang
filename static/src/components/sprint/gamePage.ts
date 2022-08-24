import Control from '../common/control';
import { Word } from '../api/dbWords';
import SprintState from './sprintState';
import Timer from './timer';
import SVG from '../common/svgElement';
import icons from '../../assets/icons/sprite.svg';
import Question from './question';
import ButtonAnswer from './buttonAnswer';
import soundManager from '../common/soundManager';
import StartPage from './startPage';
import ButtonReturn from './buttonReturn';
import ResultPage from './resultPage';

enum TextInner {
  points = '0',
  buttonTrue = '→ True',
  buttonFalse = 'False ←'
}

const TIME = 60;

class GamePage extends Control {
  private correctAnswerSeries: number = 0;

  private settingsSoundWrap: Control;

  private soundSettings: SVG | null = null;

  private animationWrap: Control | null = null;

  private pointsView: Control;

  private questionWrap: Control;

  private indicatorWrap: Control;

  private rateWrap: Control;

  private timerWrap: Control;

  private buttonReturn: Control;

  private indicatorList: SVG[] = [];

  private iconRateList: SVG[] = [];

  private words: Word[] = [];

  private buttonList: ButtonAnswer[];

  private timer: Timer;

  private results: Boolean[] = [];

  private rate: number = 1;

  private countRightAnswer: number = 0;

  private onGetAnswer: (answer: boolean) => void;

  constructor(
    public parentNode: HTMLElement | null,
    private state: SprintState,
    private questions: string[][]
  ) {
    super(parentNode, 'div', 'sprint__game');
    this.onGetAnswer = () => {};
    this.state.onSoundOn.add(this.renderSoundSettings.bind(this));

    this.buttonReturn = new ButtonReturn(this.node, 'sprint__button sprint__button_return');
    this.buttonReturn.node.onclick = () => {
      const startPage = new StartPage(parentNode, this.state, this.state.getInitiator());
      this.destroy();
    };

    this.settingsSoundWrap = new Control(this.node, 'div', 'sound__wrap');

    this.timerWrap = new Control(this.node, 'div', 'sprint__timer-wrap');
    this.timer = new Timer(this.timerWrap.node, 'sprint__timer');

    this.indicatorWrap = new Control(this.node, 'div', 'sprint__indicator-wrap');

    this.rateWrap = new Control(this.node, 'div', 'sprint__rate-wrap');

    this.pointsView = this.renderPoints();

    this.questionWrap = new Control(this.node, 'div', 'sprint__question-wrap');

    this.buttonList = this.renderButtons();

    this.init();
  }

  private async init() {
    this.renderSoundSettings(this.state.getSoundPlay());

    this.indicatorList = this.renderIndicator();
    this.indicatorList.forEach((indicator) => { indicator.addClass('default'); });

    this.renderRate();

    this.buttonList.forEach((button) => {
      button.node.onclick = () => {
        if (button.value !== undefined) this.onGetAnswer(button.value);
      };
    });

    document.onkeydown = (e) => {
      if (e.code === 'ArrowLeft') this.onGetAnswer(false);
      if (e.code === 'ArrowRight') this.onGetAnswer(true);
    };

    this.animationWrap = new Control(this.parentNode, 'div', 'sprint__animation-wrap');

    this.timer.start(TIME);
    this.timer.onTimeFinishing = () => {
      this.timerWrap.node.classList.add('finishing');

      if (this.state.getSoundPlay()) {
        soundManager.playTimer();
        return true;
      }
      return false;
    };

    this.timer.onTimeOut = () => {
      this.timer.stop();
      setTimeout(() => {
        this.finish();
      }, 1000);
    };

    this.questionCycle(0);
  }

  private renderSoundSettings(isSoundOn: boolean) {
    if (this.soundSettings) this.soundSettings.destroy();

    if (isSoundOn) {
      this.soundSettings = new SVG(this.settingsSoundWrap.node, 'sound', `${icons}#volume`);
    } else {
      this.soundSettings = new SVG(this.settingsSoundWrap.node, 'sound', `${icons}#mute`);
    }

    this.soundSettings.svg.onclick = () => {
      this.state.setSoundPlay(!this.state.getSoundPlay());
      const curentState = this.state.getSoundPlay();
      if (curentState) {
        soundManager.restartPlayTimer();
      } else {
        soundManager.stopPlayTimer();
      }
    };
  }

  private renderIndicator() {
    return [
      new SVG(this.indicatorWrap.node, 'sprint__indicator', `${icons}#ind0`),
      new SVG(this.indicatorWrap.node, 'sprint__indicator', `${icons}#ind1`),
      new SVG(this.indicatorWrap.node, 'sprint__indicator', `${icons}#ind2`),
    ];
  }

  private renderRate() {
    this.iconRateList.push(new SVG(this.rateWrap.node, 'sprint__rate', `${icons}#rate`));
  }

  private renderPoints() {
    const pointsWrap = new Control(this.node, 'div', 'sprint__points-wrap');
    return new Control(pointsWrap.node, 'span', 'sprint__points', TextInner.points);
  }

  private renderButtons() {
    const buttonWrap = new Control(this.node, 'div', 'sprint__button-wrap');

    return [
      new ButtonAnswer(
        buttonWrap.node,
        'sprint__button sprint__button_false',
        TextInner.buttonFalse,
        false,
      ),
      new ButtonAnswer(
        buttonWrap.node,
        'sprint__button sprint__button_true',
        TextInner.buttonTrue,
        true,
      ),
    ];
  }

  private questionCycle(indexQuestion: number) {
    if (indexQuestion >= this.questions.length) {
      this.timer.stop();
      this.finish();
      return;
    }

    const question = new Question(this.questionWrap.node, this.questions[indexQuestion], this.state);

    this.onGetAnswer = (value: boolean) => {
      const result = question.onAnswer(value);

      if (result) {
        this.countRightAnswer += 10 * this.rate;
        this.pointsView.node.textContent = this.countRightAnswer.toString();

        this.correctAnswerSeries += 1;
        this.checkAnswerSeries(this.correctAnswerSeries);

        if (this.state.getSoundPlay()) soundManager.playOk();
      } else {
        this.resetAnswerSeries();

        if (this.state.getSoundPlay()) soundManager.playFail();
      }

      this.results.push(result);
      question.destroy();
      this.questionCycle(indexQuestion + 1);
    };
  }

  private checkAnswerSeries(correctAnswerSeries: number) {
    this.indicatorList[correctAnswerSeries - 1].delClass('default');
    if (correctAnswerSeries === 3) {
      if (this.rate < 6) {
        this.rate += 1;
        this.renderRate();
      }
      setTimeout(() => {
        this.correctAnswerSeries = 0;
        this.indicatorList.forEach((indicator) => { indicator.addClass('default'); });
      }, 1000);
    }
  }

  private resetAnswerSeries() {
    this.iconRateList.forEach((svg) => svg.destroy());
    this.indicatorList.forEach((indicator) => { indicator.addClass('default'); });
    this.correctAnswerSeries = 0;
    this.rate = 1;
  }

  public render() {
    return this.node;
  }

  public destroy() {
    if (this.animationWrap) this.animationWrap.destroy();
    this.timer.stop();
    soundManager.stopPlayTimer();
    super.destroy();
  }

  private finish() {
    this.destroy();
    const resultPage = new ResultPage(this.parentNode, this.state, this.words, this.results);
  }
}

export default GamePage;