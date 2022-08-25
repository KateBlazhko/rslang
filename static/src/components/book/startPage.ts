import { IWord } from "../api/Words";
import Control from "../common/control";
import ButtonAnswer from "./buttonAnswer";
import BookState from "./bookState";
import CreateWordItem from "./createWordItem";
import bookConfig from "../../constants/bookConfig";

enum TextInner {
  title = "Book",
  pagesText = "Choose page",
  levelsText = "Choose level",
}

const COUNTLEVELS = 6;

class StartPage extends Control {
  constructor(
    private parentNode: HTMLElement | null,
    private words: IWord[],
    private state: BookState
  ) {
    super(parentNode, "div", "book__start start");
    this.renderStartPage();
  }

  private renderStartPage() {
    const pagesText = new Control(
      this.node,
      "div",
      "book__desription book__desription_odd"
    );
    pagesText.node.innerHTML = `
    <span>${TextInner.pagesText}</span>
    <div class="book__button-wrap book__button-wrap_pseudo">
      <div class="book__button book__button-previous"><span>←</span></div>
      <div class="book__button book__button-current-page">1</div>
      <div class="book__button book__button-next"><span>→</span></div>
    </div>
    `;

    const buttonNext = document.querySelector(".book__button-next");
    const buttonPrevious = document.querySelector(".book__button-previous");
    const currentPage = document.querySelector(".book__button-current-page");
    buttonNext?.addEventListener("click", () => {
      if (
        currentPage?.textContent &&
        +currentPage.textContent <= bookConfig.maxPage
      ) {
        currentPage.innerHTML = `${+currentPage.innerHTML + 1}`;
      }
    });
    buttonPrevious?.addEventListener("click", () => {
      if (currentPage?.textContent && +currentPage.textContent > 1) {
        currentPage.innerHTML = `${+currentPage.innerHTML - 1}`;
      }
    });

    const button = new Control(
      this.node,
      "div",
      "book__desription book__desription_even",
      TextInner.levelsText
    );
    const buttonWrap = new Control(button.node, "div", "book__button-wrap");

    [...Array(COUNTLEVELS).keys()].map((item) => {
      const button = new ButtonAnswer(
        buttonWrap.node,
        "book__button",
        (item + 1).toString()
      );
      button.node.onclick = () => {
        // this.state.onPreload.emit([item]);
        // this.destroy();
      };

      return button;
    });

    const wordsBlock = new Control(this.node, "div", "book__wrapper");

    this.words.forEach((wordItem) => {
      const bookItem = new Control(wordsBlock.node, "div", "book__item");
      new CreateWordItem(wordItem, bookItem);
    });
  }

  public render() {
    return this.node;
  }
}

export default StartPage;
