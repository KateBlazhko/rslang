import Words, { IWord } from "../api/Words";
import Control from "../common/control";
import Signal from "../common/signal";
import BookState from "./bookState";
import StartPage from "./startPage";
import randomSort from "../common/functions";
import Logging from "../Logging";

enum TextInner {
  preloader = "We're getting closer, get ready...",
  error = "Something is wrong? try again...",
}

export interface IWordStat {
  wordId: string;
  answer: boolean;
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
    private onGoBook: Signal<string>
  ) {
    console.log('!!!')
    super(parentNode, "div", "book");
    this.state = new BookState();
    this.state.onPreload.add(this.renderPreloader.bind(this));
    onGoBook.add(this.state.setInitiator.bind(this.state));

    this.preloader = new Control(
      null,
      "span",
      "sprint__preloader",
      TextInner.preloader
    );

    this.startPage = new StartPage(this.node, this.state);
    this.onFinish.add(this.recordStatToBD.bind(this));
  }

  public onFinish = new Signal<IWordStat[]>();

  private async renderPreloader(words: number[]) {
    const [group, page] = words;
    this.node.append(this.preloader.node);
    console.log('!')
    this.words = await this.getWords(group);
    console
    this.preloader.destroy();
  }

  private async getWords(level = 0, page = 0) {
    try {
      console.log(page)
      if (page) {
        console.log('!')
        const words = await Words.getWords({
          group: level,
          page,
        });
        console.log(words)
        return randomSort(words);
      }
      const wordsAll = await Promise.all(
        [...Array(COUNTPAGE).keys()].map((key) =>
          Words.getWords({
            group: level,
            page: key,
          })
        )
      );
      const worsResult = wordsAll.flat();
      console.log(worsResult);
      return worsResult;
    } catch {
      this.preloader.node.textContent = TextInner.error;
      setTimeout(() => {
        this.preloader.destroy();
        console.log('!')
        this.startPage = new StartPage(this.node, this.state);
      });
      return [];
    }
  }

  private async recordStatToBD(wordsStat: IWordStat[]) {
    const stateLog = await this.login.checkStorageLogin();
    if (stateLog.state) {
      const userWordsAll = await Words.getUserWords(
        stateLog.userId,
        stateLog.token
      );

      const recordResult = await Promise.all(
        wordsStat.map((word) => {
          const userWord = userWordsAll.find(
            (item) => item.optional.wordId === word.wordId
          );
          if (userWord) {
            return Words.updateUserStat(stateLog, userWord, word.answer);
          }
          return Words.createUserStat(stateLog, word);
        })
      );
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
