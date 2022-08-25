import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import Signal from '../common/signal';
import BookState from './bookState';
import StartPage from './startPage';
import randomSort from '../common/functions';
import Logging from '../Logging';

enum TextInner {
  preloader = 'We\'re getting closer, get ready...',
  error = 'Something is wrong? try again...'
}

export interface IWordStat {
  wordId: string,
  answer: boolean
}

const COUNTPAGE = 30;

class Book extends Control {
  private preloader: Control;

  private words: IWord[] = [];

  private state: BookState;

  private startPage: StartPage;


  private questions: [IWord, string][] = [];

  constructor(
    private parentNode: HTMLElement | null,
    private login: Logging,
    private onGoBook: Signal<string>,
  ) {
    super(parentNode, 'div', 'sprint');
    this.state = new BookState();
    this.state.onPreload.add(this.renderPreloader.bind(this));
    onGoBook.add(this.state.setInitiator.bind(this.state));

    this.preloader = new Control(null, 'span', 'sprint__preloader', TextInner.preloader);

    this.startPage = new StartPage(this.node, this.state);
    this.onFinish.add(this.recordStatToBD.bind(this));
  }

  public onFinish = new Signal<IWordStat[]>();

  private async renderPreloader(words: number[]) {
    const [group, page] = words;
    this.node.append(this.preloader.node);

    if (this.state.getInitiator() === 'header') {
      this.words = await this.getWords(group);
    } else {
      // todo this.questions = await this.getQuestions(group, page)
    }

    this.preloader.destroy();
  }

  private async getWords(level: number, page?: number) {
    try {
      if (page) {
        const words = await Words.getWords({
          group: level,
          page,
        });
        return randomSort(words);
      }
      const wordsAll = await Promise.all([...Array(COUNTPAGE).keys()].map((key) => Words.getWords({
        group: level,
        page: key,
      })));

      return randomSort(wordsAll.flat());
    } catch {
      this.preloader.node.textContent = TextInner.error;
      setTimeout(() => {
        this.preloader.destroy();
        this.startPage = new StartPage(this.node, this.state);
      });
      return [];
    }
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
    // if (this.gamePage) {
    //   this.gamePage.destroy();
    // }

    // super.destroy();
  }
}

export default Book;
