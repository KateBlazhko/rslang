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

// const COUNTPAGE = 30;

class Book extends Control {
  private preloader: Control;

  private words: IWord[] = [];

  private state: BookState;

  private startPage: StartPage | undefined;

  private questions: [IWord, string][] = [];

  constructor(
    private parentNode: HTMLElement | null,
    private login: Logging,
    private onGoBook: Signal<string>
  ) {
    super(parentNode, "div", "book");

    this.state = new BookState();
    // this.state.onPreload.add(this.renderPreloader.bind(this));
    onGoBook.add(this.state.setInitiator.bind(this.state));
    this.getWords();
    this.preloader = new Control(
      null,
      "span",
      "book__preloader",
      TextInner.preloader
    );

    // this.startPage = new StartPage(this.node, this.state);
  }

  public onFinish = new Signal<IWordStat[]>();

  // private async renderPreloader(words: number[]) {
  //   const [group, page] = words;
  //   this.node.append(this.preloader.node);
  //   this.words = await this.getWords();
  //   this.preloader.destroy();
  // }

  private async getWords(level = 0, page = 0) {
    try {
      const words = await Words.getWords({
        group: level,
        page,
      });

      this.startPage = new StartPage(this.node, words, this.state);

      // return randomSort(words);
      // const wordsAll = await Promise.all(
      //   [...Array(COUNTPAGE).keys()].map((key) =>
      //     Words.getWords({
      //       group: level,
      //       page: key,
      //     })
      //   )
      // );
      // const worsResult = wordsAll.flat();
      // return worsResult;
    } catch {
      // this.preloader.node.textContent = TextInner.error;
      // setTimeout(() => {
      //   this.preloader.destroy();
      //   this.startPage = new StartPage(this.node, this.state);
      // });
      // return [];
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
