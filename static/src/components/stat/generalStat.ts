import { Chart, registerables } from 'chart.js';
import Stats, { GeneralItem, IGeneral } from '../api/Stats';
import Words from '../api/Words';
import Control from '../common/control';
import Logging, { IStateLog } from '../login/Logging';
import { adapterDate } from '../utils/functions';

const DEFAULTWIDTH = 600
const DEFAULTHEIGHT = 400

Chart.register(...registerables);

class GeneralStat extends Control {
  private chart: Control;

  constructor(
    public parentNode: HTMLElement | null,
    private login: Logging,
  ) {
    super(parentNode, 'div', 'stat__general general');

    this.chart = new Control(this.node, 'div', 'general__chart-wrap');
    this.updateStat();
  }

  private async updateStat() {
    const stateLog = await this.login.checkStorageLogin();

    const userStat = await Stats.getStats(stateLog.userId, stateLog.token);
    const { optional: { dateReg, general } } = userStat;

    await this.recordToStat(stateLog, dateReg, general);
  }

  private async recordToStat(stateLog: IStateLog, dataRegString: string, general: IGeneral) {
    const date = new Date();

    const { newWords, learnedWords } = general;

    const newWordsStats = {
      ...(await this.dateLoop(
        stateLog,
        GeneralStat.getCountNewWordsByDate,
        new Date(dataRegString),
        date,
        newWords,
        {},
      )),
    };
    const learnedWordsStats = {
      ...(await this.dateLoop(
        stateLog,
        GeneralStat.getCountLearnedWordsByDate,
        new Date(dataRegString),
        date,
        learnedWords,
        {},
      )),
    };

    await Stats.recordGeneralStats(stateLog, newWordsStats, learnedWordsStats);

    const userStatNew = await Stats.getStats(stateLog.userId, stateLog.token);
    const { optional: { general: generalNew } } = userStatNew;
    this.drawСhart(generalNew);
  }

  private async dateLoop(
    stateLog: IStateLog,
    callback: (date: string, state: IStateLog) => Promise<number>,
    index: Date | null,
    currentDate: Date,
    general: GeneralItem,
    newGeneralStats: GeneralItem,
  ): Promise<GeneralItem> {

    if (!index) {
      return newGeneralStats;
    }

    if (adapterDate(currentDate) === adapterDate(index)) {
      newGeneralStats[adapterDate(index)] = await callback(adapterDate(index), stateLog);
      return {
        ...(await this.dateLoop(stateLog, callback, null, currentDate, general, newGeneralStats)),
      };
    }

    if (!general[adapterDate(index)]) {
      newGeneralStats[adapterDate(index)] = await callback(adapterDate(index), stateLog);
    }
    index.setDate(index.getDate() + 1);

    return {
      ...(await this.dateLoop(stateLog, callback, index, currentDate, general, newGeneralStats)),
    };
  }

  private static async getCountNewWordsByDate(date: string, stateLog: IStateLog) {
    const words = await Words.getNewWordsByDate(stateLog, date);

    return words.length;
  }

  private static async getCountLearnedWordsByDate(date: string, stateLog: IStateLog) {
    const words = await Words.getLearnedWordsByDate(stateLog, date);

    return words.length;
  }

  private drawСhart(general: IGeneral) {
    const canvas = new Control<HTMLCanvasElement>(this.chart.node, 'canvas', 'stat__canvas');
    const ctx = canvas.node.getContext('2d');
    canvas.node.width = DEFAULTWIDTH
    canvas.node.height = DEFAULTHEIGHT

    const { newWords, learnedWords } = general;

    const learnedWordsData = GeneralStat.getDataAboutLearnedWords(GeneralStat.sortData(learnedWords));

    if (ctx) {
      GeneralStat.drawLineChart(ctx, GeneralStat.sortData(newWords), learnedWordsData);
    }
  }

  private static getDataAboutLearnedWords(learnedWords: GeneralItem) {

    return Object.values(learnedWords)
      .map((value, index, array) => {
        const sumPrevItems = array
          .slice(0, index)
          .reduce((sum, item) => sum + item, 0);
        return value + sumPrevItems;
      });
  }

  private static sortData(data: GeneralItem) {
    const arr = Object.entries(data)
    const sortArr = [...arr].sort((a, b) => {
      const [keyA] = a
      const [keyB] = b

      const numberA = Number(keyA.split('-').join(''))
      const numberB = Number(keyB.split('-').join(''))

      return numberA - numberB
    })

    return Object.fromEntries(sortArr)
  }

  private static drawLineChart(
    ctx: CanvasRenderingContext2D,
    newWords: GeneralItem,
    learnedWordsData: number[],
  ) {
    const labels = Object.keys(newWords);
    const data = {
      labels,
      datasets: [
        {
          label: 'The number of new words',
          data: Object.values(newWords),
          fill: false,
          borderColor: '#1f9465',
          tension: 0.1,
        },
        {
          label: 'The increase of learned words',
          data: learnedWordsData,
          fill: false,
          borderColor: '#e0677d',
          tension: 0.1,
        },
      ],
    };
    const config = {
      type: 'line',
      data,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'General stats by new words by day',
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

export default GeneralStat;
