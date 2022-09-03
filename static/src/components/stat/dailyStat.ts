import { Chart, registerables } from 'chart.js';
import Stats, { IGameStat, IStatOptional } from '../api/Stats';
import Words from '../api/Words';
import Control from '../common/control';
import Logging, { IStateLog } from '../login/Logging';
import { adapterDate, getPercent } from '../utils/functions';
import ButtonStat from './buttonStat';

Chart.register(...registerables);

enum TextInner {
  newWords = 'New words',
  errors = 'Error answer: 0',
  rights = 'Right answer: 0',
  maxSeriesRightAnswer = 'Right answer series',
  learnedWords = 'Learned words'
}

class DailyStat extends Control {
  private buttonWrap: Control;

  private statWrap: Control | null = null;

  constructor(
    public parentNode: HTMLElement | null,
    private login: Logging,
  ) {
    super(parentNode, 'div', 'stat__daily daily');

    this.buttonWrap = new Control(this.node, 'div', 'daily__button-wrap');
    const buttonName = ['sprint', 'audio', 'book'];
    const buttonList = buttonName.map((name) => this.drawButton(name));

    const [firstButton] = buttonList;
    firstButton.node.classList.add('active');
    this.getStat(firstButton.name);

    buttonList.forEach((button, indexButton, arr) => {
      button.node.onclick = () => {
        button.node.classList.add('active');

        arr
          .filter((_item, index) => index !== indexButton)
          .forEach((item) => {
            item.node.classList.remove('active');
          });

        this.getStat(button.name);
      };
      return button;
    });
  }

  private drawButton(name: string) {
    const icon = new ButtonStat(this.buttonWrap.node, 'daily__icon', '', name);

    const img = new Control<HTMLImageElement>(icon.node, 'img', 'daily__img');
    img.node.src = `./assets/img/${name}.png`;
    const text = new Control(icon.node, 'div', 'daily__text');
    text.node.innerHTML = `
    <span>${name[0].toUpperCase()}${name.slice(1)}</span>
    `;
    return icon;
  }

  private static async checkStat(dataCurrent: string, stateLog: IStateLog) {
    const userStat = await Stats.getStats(stateLog.userId, stateLog.token);

    const isSameDate = userStat.optional.dateCurrent === dataCurrent;
    if (isSameDate) {
      return userStat;
    }
    const resultResetStat = await Stats.resetStat(stateLog, userStat, dataCurrent);
    const userStatNew = await Stats.getStats(stateLog.userId, stateLog.token);
    return userStatNew;
  }

  private async getStat(name: string) {
    const stateLog = await this.login.checkStorageLogin();
    const date = adapterDate(new Date());

    DailyStat.checkStat(date, stateLog);

    const stat = await DailyStat.checkStat(date, stateLog);
    const learnedWords = await Words.getLearnedWordsByDate(stateLog, date);
    const newWordsAll = await Words.getNewWordsByDate(stateLog, date);

    this.drawStat(name);

    if (name === 'book') {
      const gameStatSprint = stat.optional.sprint;
      const { countError: errorSprint, сountRightAnswer: rightSprint } = gameStatSprint;
      const gameStatAudio = stat.optional.audio;
      const { countError: errorAudio, сountRightAnswer: rightAudio } = gameStatAudio;

      const countlearnedWords = learnedWords.length;

      const countNewWords = newWordsAll.length;

      this.drawStatWords(
        countlearnedWords,
        countNewWords,
        errorSprint + errorAudio,
        rightSprint + rightAudio,
      );
    } else {
      const gameStat = stat.optional[name as keyof IStatOptional] as IGameStat;
      this.drawStatGame(gameStat);
    }
  }

  private drawStat(name: string) {
    if (this.statWrap) this.statWrap.destroy();

    this.statWrap = new Control(this.node, 'div', 'daily__stat-wrap');

    const title = new Control(this.statWrap.node, 'h3', 'daily__name', name[0].toUpperCase() + name.slice(1));
  }

  private drawStatWords(
    learnedWords: number,
    newWords: number,
    errors: number,
    rights: number,
  ) {
    if (this.statWrap) {
      const percent = getPercent(errors, errors + rights);
      if (percent) {
        const canvas = new Control<HTMLCanvasElement>(this.statWrap.node, 'canvas', 'stat__canvas');
        const ctx = canvas.node.getContext('2d');

        if (ctx) {
          DailyStat.drawChart(ctx, percent);
        }
      } else {
        const text = [
          new Control(this.statWrap.node, 'span', 'daily__item', TextInner.errors),
          new Control(this.statWrap.node, 'span', 'daily__item', TextInner.rights),
        ];
      }

      const text = [
        new Control(
          this.statWrap.node,
          'span',
          'daily__item',
          `${TextInner.learnedWords}: ${learnedWords}`,
        ),
        new Control(
          this.statWrap.node,
          'span',
          'daily__item',
          `${TextInner.newWords}: ${newWords}`,
        ),
      ];
    }
  }

  private drawStatGame(gameStat: IGameStat) {
    if (this.statWrap) {
      const {
        countError, сountRightAnswer, maxSeriesRightAnswer, newWords,
      } = gameStat;

      const percent = getPercent(countError, countError + сountRightAnswer);
      if (percent) {
        const canvas = new Control<HTMLCanvasElement>(this.statWrap.node, 'canvas', 'stat__canvas');
        const ctx = canvas.node.getContext('2d');

        if (ctx) {
          DailyStat.drawChart(ctx, percent);
        }
      } else {
        const text = [
          new Control(this.statWrap.node, 'span', 'daily__item', TextInner.errors),
          new Control(this.statWrap.node, 'span', 'daily__item', TextInner.rights),
        ];
      }

      const text = [
        new Control(
          this.statWrap.node,
          'span',
          'daily__item',
          `${TextInner.maxSeriesRightAnswer}: ${maxSeriesRightAnswer}`,
        ),
        new Control(
          this.statWrap.node,
          'span',
          'daily__item',
          `${TextInner.newWords}: ${newWords}`,
        ),
      ];
    }
  }

  private static drawChart(ctx: CanvasRenderingContext2D, percent: number) {
    const data = {
      labels: [
        'Errors',
        'Right',
      ],
      datasets: [{
        label: 'Answers',
        data: [percent, 100 - percent],
        backgroundColor: [
          '#e0677d',
          '#1f9465',
        ],
        hoverOffset: 4,

      }],
    };

    const config = {
      type: 'doughnut',
      data,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Answers',
            font: {
              size: 16,
              family: "'Nunito', sans-serif",

            },
          },
        },
      },
    };

    const myChart = new Chart(ctx, config);
  }
}

export default DailyStat;
