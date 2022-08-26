import Control from '../common/control';

class StartPageAudio extends Control {
  private title: Control<HTMLElement>;

  private arrBtn: Array<{node: HTMLButtonElement, difficult: number}>;

  private containerBtn: Control<HTMLElement>;

  public difficult: number;

  public startBtn: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement | null,
  ) {
    super(parentNode, 'div', 'start__page__audio');
    this.title = new Control(this.node, 'h1', 'audio_call__title', 'Выберите сложность и нажмите начать');
    this.containerBtn = new Control(this.node, 'div', 'audio_container__btn');
    this.startBtn = new Control(this.node, 'button', 'start_btn__audio', 'START');
    this.arrBtn = [];
    this.difficult = 1;
    this.createBtnDifficult();
  }

  private createBtnDifficult(): void {
    for (let i = 1; i <= 6; i += 1) {
      const btn = new Control<HTMLButtonElement>(this.containerBtn.node, 'button', '', `${i}`);
      this.arrBtn.push({
        node: btn.node,
        difficult: i,
      });
      if (i === 1) this.addActive(btn.node);
    }

    this.arrBtn.forEach((item) => {
      item.node.addEventListener('click', () => {
        this.difficult = item.difficult;
        this.addActive(item.node);
      });
    });
  }

  private addActive(node: HTMLButtonElement): void {
    this.arrBtn.forEach((item) => item.node.classList.remove('active'));
    node.classList.add('active');
  }

  render(node: HTMLElement) {
    node.append(this.node);
  }
}

export default StartPageAudio;
