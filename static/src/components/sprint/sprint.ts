import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import Signal from '../common/signal';
import GamePage from './gamePage';
import SprintState from './sprintState';
import StartPage from './startPage';
import randomSort from '../utils/functions';
import Logging, { IStateLog } from '../login/Logging';
import Stats, { IGameStat } from '../api/Stats';
import bookConfig from '../constants/bookConfig';

enum TextInner {
  preloader = 'We\'re getting closer, get ready...',
  error = 'Something is wrong? try again...'
}

export interface IWordStat {
  wordId: string,
  answer: boolean
}

export type Stat = [IWordStat[], IGameStat]

class Sprint extends Control {
  private sprintWrap: Control;

  private preloader: Control;

  private words: IWord[] = [];

  private state: SprintState;

  private startPage: StartPage;

  private gamePage: GamePage | null = null;

  private questions: [IWord, string][] = [];

  private animationWrap: Control | null = null;

  constructor(
    private parentNode: HTMLElement | null,
    private login: Logging,
    private prevPage: { page: string; },
  ) {
    super(parentNode, 'div', 'sprint');

    this.sprintWrap = new Control(this.node, 'div', 'sprint__wrap');
    this.state = new SprintState();
    this.state.setInitiator(this.prevPage.page);
    this.state.onPreload.add(this.renderPreloader.bind(this));

    this.preloader = new Control(null, 'span', 'sprint__preloader', TextInner.preloader);

    this.startPage = new StartPage(this.sprintWrap.node, this.state);
    this.onFinish.add(this.recordStatToBD.bind(this));
  }

  public onFinish = new Signal<Stat>();

  private async renderPreloader(words: number[]) {
    const [group, page] = words;
    this.node.append(this.preloader.node);
    try {

      if (!this.state.getInitiator().includes('book')) {
        this.words = await this.getWords(group);
      } else {
        const stateLog = await this.login.checkStorageLogin();

        if (stateLog.state) {
          if (group === bookConfig.numberDifficultGroup) {
            this.words = await Sprint.getDifficultWord(stateLog);
          } else if (group === bookConfig.numberCustomGroup) {
            this.words = await Sprint.getCustomWord(group);
          } else if (page !== undefined) {

            this.words = await this.getAggregatedWords(words);
          } else {
            this.words = await this.getWords(group);
          }
        } else {
          this.words = await this.getWords(group, page);
        }
      }

      this.preloader.destroy();
      this.animationWrap = new Control(this.node, 'div', 'sprint__animation-wrap');

      this.gamePage = new GamePage(
        this.sprintWrap.node,
        this.state,
        this.words,
        this.onFinish,
        this.animationWrap,
      );
    } catch {
      this.preloader.node.textContent = TextInner.error;
      setTimeout(() => {
        this.preloader.destroy();
        this.startPage = new StartPage(this.sprintWrap.node, this.state);
      }, 2000);
    }
  }

  private static async getDifficultWord(stateLog: IStateLog) {
    const words: IWord[] = [];
    const res = await Words.getDifficultyWords(stateLog);
    return Words.adapterAggregatedWords(res);
  }

  private static async getCustomWord(group: number) {
    const words: IWord[] = [];
    const res = await Words.getCustomWords(group);
    return res;
  }

  private async getWords(group: number, page?: number) {
    try {
      if (page !== undefined) {
        const words = await Words.getWords({
          group: group.toString(),
          page: page.toString(),
        });

        return randomSort(await Words.checkWords(words, group, page)) as IWord[];
      }

      // const randomPage = randomSort([...Array(bookConfig.maxPage).keys()]).slice(0, 15) as number[];
      const randomPage = randomSort([...Array(bookConfig.maxPage).keys()]) as number[];
      
      const wordsAll = await Promise.all(randomPage.map((key) => Words.getWords({
        group: group.toString(),
        page: key.toString(),
      })));

      return randomSort(wordsAll.flat()) as IWord[];
    } catch {
      this.preloader.node.textContent = TextInner.error;
      setTimeout(() => {
        this.preloader.destroy();
        this.startPage = new StartPage(this.sprintWrap.node, this.state);
      });
      return [];
    }
  }

  private async getAggregatedWords(words: number[]) {
    const [group, page] = words;

    const stateLog = await this.login.checkStorageLogin();

    if (stateLog.state) {
      const aggregatedWords = await Words.getNoLearnWords(stateLog, group);
      const aggregatedWordsFull = await Words.checkAggregatedWords(
        aggregatedWords,
        group,
        page,
        stateLog,
      );

      return randomSort(aggregatedWordsFull) as IWord[];
    }

    throw new Error('no logging');
  }

  private async recordStatToBD(stat: Stat) {
    const [wordsStat, gameStat] = stat;

    const stateLog = await this.login.checkStorageLogin();
    if (stateLog.state) {
      const userWordsAll = await Words.getUserWords(stateLog.userId, stateLog.token);

      const recordWordResult = await Promise.all(wordsStat.map((word) => {
        const userWord = userWordsAll.find((item) => item.optional.wordId === word.wordId);
        if (userWord) {
          if (userWord.optional.dataGetNew === undefined) {
            gameStat.newWords += 1;
          }
          return Words.updateWordStat(stateLog, userWord, word.answer);
        }
        gameStat.newWords += 1;
        return Words.createWordStat(stateLog, word);
      }));

      const recordGameResult = await Stats.recordGameStats(stateLog, gameStat, 'sprint');
    }
  }

  public destroy() {
    if (this.gamePage) {
      this.gamePage.destroy();
    }

    super.destroy();
  }
}

export default Sprint;
