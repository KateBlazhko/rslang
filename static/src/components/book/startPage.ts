import Control from "../common/control";
import ButtonAnswer from "./buttonAnswer";
import BookState from "./bookState";

// enum TextInner {
//   first = 'Капитан! Мы нашли пещеру, полную сокровищ!!!',
//   second =
//   `Торопитесь, до прилива осталась ровно 1 минута!! Какой вы хотите уровень сложности?`,
//   pagesText =
//   'Выбирайте, соответствует ли перевод предложенному слову, и собирайте сокровища',
//   fourth = `Можно использовать мышку или клавиатуру`
// }

enum TextInner {
  title = "Book",
  pagesText = "Choose page",
  levelsText = "Choose level",
  buttonFromBook = "Start",
}

const COUNTLEVELS = 6;

class StartPage extends Control {
  constructor(
    private parentNode: HTMLElement | null,
    private state: BookState
  ) {
    super(parentNode, "div", "sprint__start start");

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

    const fourth = new Control(
      this.node,
      "div",
      "start__desription start__desription_even",
      TextInner.levelsText
    );
    const buttonWrap = new Control(fourth.node, "div", "start__button-wrap");

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
