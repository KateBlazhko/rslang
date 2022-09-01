import Stats, { GeneralItem, IGeneral } from '../api/Stats';
import Words from '../api/Words';
import Control from '../common/control';
import Logging, { IStateLog } from '../login/Logging';
import { adapterDate } from '../utils/functions';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

class GeneralStat extends Control {
  private chart: Control

  constructor(
    public parentNode: HTMLElement | null,
    private login: Logging
  ) {
    super(parentNode, 'div', 'stat__general general');

    this.chart = new Control(this.node, 'div', 'general__chart-wrap');
    this.updateStat()

  }

  private async updateStat() {
    const stateLog = await this.login.checkStorageLogin()

    const userStat = await Stats.getStats(stateLog.userId, stateLog.token)  
    const { optional: { dateReg, general } } = userStat

    await this.recordToStat(stateLog, dateReg, general)
  }

  private async recordToStat(stateLog: IStateLog, dataRegString: string, general: IGeneral) {
    const date = new Date()
    const dataReg = new Date( dataRegString )

    const { newWords, learnedWords } = general

    const newWordsStats = {
      ...(await this.dateLoop(stateLog, this.getCountNewWordsByDate, dataReg, date, newWords, {}))
    }

    const learnedWordsStats = {
      ...(await this.dateLoop(stateLog, this.getCountLearnedWordsByDate, dataReg, date, learnedWords, {}))
    }

    await Stats.recordGeneralStats(stateLog, {
      newWords: newWordsStats,
      learnedWords: learnedWordsStats
    })
    const userStatNew = await Stats.getStats(stateLog.userId, stateLog.token)  
    const { optional: { general: generalNew } } = userStatNew

    this.drawСhartNewWords(generalNew)

  }

  private async dateLoop(
    stateLog: IStateLog,
    callback: (date: string, stateLog: IStateLog) =>  Promise<number>,
    index: Date | null, 
    date: Date, 
    general: GeneralItem,
    newGeneralStats: GeneralItem
  ): Promise<GeneralItem> {

    if (!index) {
      return newGeneralStats
    }

    if (adapterDate(date) === adapterDate(index)) {
      newGeneralStats[adapterDate(index)] = await callback(adapterDate(index), stateLog)
      return {
        ...(await this.dateLoop(stateLog, callback, null, date, general, newGeneralStats))
      }
    }

    if (!general[adapterDate(index)]) {
      newGeneralStats[adapterDate(index)] = await callback(adapterDate(index), stateLog)
    }
    index.setDate(index.getDate() + 1)

    return {
      ...(await this.dateLoop(stateLog, callback, index, date, general, newGeneralStats))
    }
  }

  private async getCountNewWordsByDate(date: string, stateLog: IStateLog) {
    const words = await Words.getNewWordsByDate(stateLog, date)

    if (Array.isArray(words)) {
      return words
        .map(word => word.paginatedResults)
        .flat()
        .length
    }

    return 0
  }

  private async getCountLearnedWordsByDate(date: string, stateLog: IStateLog) {
    const words = await Words.getLearnedWordsByDate(stateLog, date)

    if (Array.isArray(words)) {
      return words
        .map(word => word.paginatedResults)
        .flat()
        .length
    }

    return 0
  }

  private drawСhartNewWords(general: IGeneral) {
    const canvas = new Control<HTMLCanvasElement>(this.chart.node, 'canvas', 'stat__canvas');
    const ctx = canvas.node.getContext('2d');

    const { newWords, learnedWords } = general

    const learnedWordsData = this.getDataAboutLearnedWords(learnedWords)

    if (ctx) {
      this.drawLineChart(ctx, newWords, learnedWordsData)
    }
  }

  private getDataAboutLearnedWords(learnedWords: GeneralItem) {
    return Object.values(learnedWords)
      .map((value, index, array) => {
        const sumPrevItems = array
          .slice(0, index)
          .reduce((sum, item) => sum + item, 0)
        return value + sumPrevItems
      })
  }

  private drawLineChart(ctx: CanvasRenderingContext2D, newWords: GeneralItem, learnedWordsData: number[]) {
    const labels = Object.keys(newWords)

    const data = {
      labels: labels,
      datasets: [
        {
        label: 'The number of new words by day',
        data: Object.values(newWords),
        fill: false,
        borderColor: '#1f9465',
        tension: 0.1
       },
       {
        label: 'The increase of total number of learned words',
        data: learnedWordsData,
        fill: false,
        borderColor: '#e0677d',
        tension: 0.1
       }
      ]
    };
    const config = {
      type: 'line',
      data: data,
      options: {
        plugins: {
          title: {
              display: true,
              text: 'General stats by new words ',
              font: {
                size: 16,
                family: "'Nunito', sans-serif"

              }
          }
        },
      }
    };  
    
    const myChart = new Chart(ctx, config)
  }
}

export default GeneralStat;
