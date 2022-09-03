import Control from '../common/control';

class StartPageAudio extends Control {
  private arrBtn: Array<{node: HTMLButtonElement, difficult: number}>;

  private containerBtn: Control<HTMLElement>;

  public difficult: number;

  public startBtn: Control<HTMLElement>;

  description: Control<HTMLElement>;

  draw: boolean;

  constructor(
    parentNode: HTMLElement | null,
    draw: boolean,
  ) {
    super(parentNode, 'div', 'start__page__audio');
    this.description = new Control(this.node, 'div', 'description__audio');
    this.createDescription();
    this.containerBtn = new Control(this.node, 'div', 'audio_container__btn');
    this.startBtn = new Control(this.node, 'button', 'start_btn__audio', 'Start');
    this.arrBtn = [];
    this.draw = true;
    this.difficult = 1;
    this.createBtnDifficult(draw);
  }

  createDescription() {
    this.description.node.innerHTML = `
      <div class='preview'>
        <h3 class="audio__title">Audio Call</h3>
        <span>Captain! You need to guess the word by ear!!!</span>
      </div>
      <div class='instruction'>
        <span>You can use a mouse or keyboard</span>
      </div>
      <div class='key-instruction'>
        <span>To select a word, press:</span>
        <div class="key-instruction__button-wrap">
          <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
        </div>
      </div>
      <div class='key-instruction-two'>
        <span>To get the next card, press:</span>
        <div class='key'><span>Enter</span></div>
      </div>
    `;
  }

  createBtnDifficult(draw: boolean): void {
    if (!draw && this.draw) {
      for (let i = 1; i <= 6; i += 1) {
        const btn = new Control<HTMLButtonElement>(this.containerBtn.node, 'button', '', `${i}`);
        this.arrBtn.push({
          node: btn.node,
          difficult: i - 1,
        });
        if (i === 1) this.addActive(btn.node);
      }

      this.arrBtn.forEach((item) => {
        item.node.addEventListener('click', () => {
          this.difficult = item.difficult;
          this.addActive(item.node);
        });
      });
      this.draw = false;
    }
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
