import { IWord } from "../api/Words";
import Control from "../common/control";
import ButtonAnswer from "./buttonAnswer";
import BookState from "./bookState";

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
      "start__desription start__desription_odd"
    );
    pagesText.node.innerHTML = `
    <span>${TextInner.pagesText}</span>
    <div class="start__button-wrap start__button-wrap_pseudo">
      <div class="start__button start__button_pseudo"><span>←</span></div>
      <div class="start__button start__button_pseudo"><span>→</span></div>
    </div>
    `;

    const wordsBlock = new Control(this.node, "div", "book__blocks");

    wordsBlock.node.innerHTML = `
      <span>'test'</span>`;

    console.log("words-words", this.words);

    const button = new Control(
      this.node,
      "div",
      "start__desription start__desription_even",
      TextInner.levelsText
    );
    const buttonWrap = new Control(button.node, "div", "start__button-wrap");

    [...Array(COUNTLEVELS).keys()].map((item) => {
      const button = new ButtonAnswer(
        buttonWrap.node,
        "start__button",
        (item + 1).toString()
      );
      button.node.onclick = () => {
        this.state.onPreload.emit([item]);
        this.destroy();
      };

      return button;
    });
  }

  public render() {
    return this.node;
  }
}

export default StartPage;
