import Words, { IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import Signal from '../common/signal';
import GamePage from './gamePage';
import SprintState from './sprintState';
import StartPage from './startPage';
import randomSort from '../common/functions';
import Logging, { IStateLog } from '../Logging';

enum TextInner {
  preloader = 'We\'re getting closer, get ready...',
  error = 'Something is wrong? try again...'
}

export interface IWordStat {
  wordId: string,
  answer: boolean
}

const COUNTPAGE = 30;
const COUNTGROUP = 6;

class Sprint extends Control {
  private preloader: Control;

  private words: IWord[] = [];

  private state: SprintState;

  private startPage: StartPage;

  private gamePage: GamePage | null = null;

  private questions: [IWord, string][] = [];

  constructor(
    private parentNode: HTMLElement | null,
    private login: Logging,
    private onGoBook: Signal<string>,
  ) {
    super(parentNode, 'div', 'sprint');
    this.state = new SprintState();
    this.state.onPreload.add(this.renderPreloader.bind(this));
    onGoBook.add(this.state.setInitiator.bind(this.state));

    this.preloader = new Control(null, 'span', 'sprint__preloader', TextInner.preloader);

    this.startPage = new StartPage(this.node, this.state, this.state.getInitiator());
    this.onFinish.add(this.recordStatToBD.bind(this));
  }

  public onFinish = new Signal<IWordStat[]>();

  private async renderPreloader(words: number[]) {
    const [group, page] = words;
    this.node.append(this.preloader.node);

    try {
      if (this.state.getInitiator() === 'book') {
        this.words = await this.getWords(group);
      } else {
        const stateLog = await this.login.checkStorageLogin();

        if (stateLog.state) {
          this.words = await this.getAggregatedWords(words);
        } else {
          this.words = await this.getWords(group, page);
        }
      }

      this.preloader.destroy();
      this.gamePage = new GamePage(this.node, this.state, this.words, this.onFinish);
    } catch {
      this.preloader.node.textContent = TextInner.error;
      setTimeout(() => {
        this.preloader.destroy();
        this.startPage = new StartPage(this.node, this.state, this.state.getInitiator());
      }, 2000);
    }
  }

  private async getWords(group: number, page?: number) {
    try {
      if (page) {
        const words = await Words.getWords({
          group: group.toString(),
          page: page.toString(),
        });

        return randomSort(await Words.checkWords(words, group, page));
      }
      const wordsAll = await Promise.all([...Array(COUNTPAGE).keys()].map((key) => Words.getWords({
        group: group.toString(),
        page: key.toString(),
      })));

      return randomSort(wordsAll.flat());
    } catch {
      this.preloader.node.textContent = TextInner.error;
      setTimeout(() => {
        this.preloader.destroy();
        this.startPage = new StartPage(this.node, this.state, this.state.getInitiator());
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

      return randomSort(aggregatedWordsFull);
    }

    throw new Error('no logging');
  }

  private async recordStatToBD(wordsStat: IWordStat[]) {
    const stateLog = await this.login.checkStorageLogin();
    if (stateLog.state) {
      const userWordsAll = await Words.getUserWords(stateLog.userId, stateLog.token);

      const recordResult = await Promise.all(wordsStat.map((word) => {
        const userWord = userWordsAll.find((item) => item.optional.wordId === word.wordId);
        if (userWord) {
          return Words.updateUserStat(stateLog, userWord, word.answer);
        }
        return Words.createUserStat(stateLog, word);
      }));
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
