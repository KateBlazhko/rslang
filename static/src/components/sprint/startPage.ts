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
  first = 'Captain! We\'ve found a cave full of treasure!!!',
  second=
  'Choose if the translation corresponds to the suggested word and collect the treasure',
  third = 'You can use a mouse or keyboard',
  fourthFromHeader =
  'Hurry up, the tide is exactly 1 minute away!!! What level of difficulty do you want?',
  fourthFromBook =
  'Hurry up, the tide is exactly 1 minute away!!!',
  buttonFromBook = 'Start'
}

const COUNTLEVELS = 6;

class StartPage extends Control {
  constructor(
    private parentNode: HTMLElement | null,
    private state: SprintState,
  ) {
    super(parentNode, 'div', 'sprint__start start');

    this.renderStartPage();
  }

  private renderStartPage() {

    this.renderCommonDescriptions()
    
    const prevPage = this.state.getInitiator()

    if (prevPage.includes('book')) {
      if (prevPage.split('/').length === 2 && prevPage.includes('difficult')) {
        const group = 7;
        const fourth = new Control(this.node, 'div', 'start__desription start__desription_even', TextInner.fourthFromBook);
  
        const button = new ButtonAnswer(fourth.node, 'start__button start__button_start', TextInner.buttonFromBook);
        button.node.onclick = () => {
          this.state.onPreload.emit([group]);
          this.destroy();
        };
      }

      if (prevPage.split('/').length >= 3) {

        const [ , group, page ] = prevPage.slice(1).split('/');
        const fourth = new Control(this.node, 'div', 'start__desription start__desription_even', TextInner.fourthFromBook);
  
        const button = new ButtonAnswer(fourth.node, 'start__button start__button_start', TextInner.buttonFromBook);
        button.node.onclick = () => {
          this.state.onPreload.emit([+group, +page]);
          this.destroy();
        };
      }
    } else {
      const fourth = new Control(this.node, 'div', 'start__desription start__desription_even', TextInner.fourthFromHeader);
      const buttonWrap = new Control(fourth.node, 'div', 'start__button-wrap');

      const buttonList = [...Array(COUNTLEVELS).keys()].map((item) => {
        const button = new ButtonAnswer(buttonWrap.node, 'start__button', (item + 1).toString());
        button.node.onclick = () => {
          this.state.onPreload.emit([item]);
          this.destroy();
        };

        return button;
      });
    }
  }

  private renderCommonDescriptions() {
    const first = new Control(this.node, 'div', 'start__desription start__desription_odd');
    first.node.innerHTML = `
    <h3 class="start__title">${TextInner.title}</h3>
    <span>${TextInner.first}</span>
    `;
    const second = new Control(this.node, 'div', 'start__desription start__desription_even', TextInner.second);

    const third = new Control(this.node, 'div', 'start__desription start__desription_odd');
    third.node.innerHTML = `
    <span>${TextInner.third}</span>
    <div class="start__button-wrap start__button-wrap_pseudo">
      <div class="start__button start__button_pseudo"><span>←</span></div>
      <div class="start__button start__button_pseudo"><span>→</span></div>
    </div>
    `;
  }

  public render() {
    return this.node;
  }
}

export default StartPage;
