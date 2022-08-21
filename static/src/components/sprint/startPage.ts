import Control from '../common/control';
import ButtonAnswer from './buttonAnswer';
import GamePage from './gamePage';
import SprintState from './sprintState';

// enum TextInner {
//   first = 'Капитан! Мы нашли пещеру, полную сокровищ!!!',
//   second =
//   `Торопитесь, до прилива осталась ровно 1 минута!! Какой вы хотите уровень сложности?`,
//   third =
//   'Выбирайте, соответствует ли перевод предложенному слову, и собирайте сокровища',
//   fourth = `Можно использовать мышку или клавиатуру`
// }

enum TextInner {
  title = 'Sprint',
  first = `Captain! We've found a cave full of treasure!!!`,
  second=
  'Choose if the translation corresponds to the suggested word and collect the treasure',
  third = 'You can use a mouse or keyboard',
  fourth =
  'Hurry up, the tide is exactly 1 minute away!!! What level of difficulty do you want?',
}

const COUNTLEVELS = 6;

class StartPage extends Control {
  constructor(private parentNode: HTMLElement | null, private state: SprintState) {
    super(parentNode, 'div', 'sprint__start start');

    this.renderStartPage();
  }

  private renderStartPage() {
    const first = new Control(this.node, 'div', 'start__desription start__desription_odd');
    first.node.innerHTML = `
    <h3 class="start__title">${TextInner.title}</h3>
    <span>${TextInner.first}</span>
    `
    const second = new Control(this.node, 'div', 'start__desription start__desription_even', TextInner.second);

    const third = new Control(this.node, 'div', 'start__desription start__desription_odd');
    third.node.innerHTML = `
    <span>${TextInner.third}</span>
    <div class="start__button-wrap start__button-wrap_pseudo">
      <div class="start__button start__button_pseudo"><span>←</span></div>
      <div class="start__button start__button_pseudo"><span>→</span></div>
    </div>
    `
    const fourth = new Control(this.node, 'div', 'start__desription start__desription_even', TextInner.fourth);


    const buttonWrap = new Control(fourth.node, 'div', 'start__button-wrap');

    const buttonList = [...Array(COUNTLEVELS).keys()].map((item) => {
      const button = new ButtonAnswer(buttonWrap.node, 'start__button', (item + 1).toString());
      button.node.onclick = () => {
        const gamePage = new GamePage(this.parentNode, this.state, item);
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
