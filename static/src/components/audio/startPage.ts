import Control from '../common/control';

class StartPageAudio extends Control {
  private arrBtn: Array<{node: HTMLButtonElement, difficult: number}>;

  private containerBtn: Control<HTMLElement>;

  public difficult: number;

  public startBtn: Control<HTMLElement>;

  description: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement | null,
  ) {
    super(parentNode, 'div', 'start__page__audio');
    this.description = new Control(this.node, 'div', 'description__audio');
    this.createDescription();
    this.containerBtn = new Control(this.node, 'div', 'audio_container__btn');
    this.startBtn = new Control(this.node, 'button', 'start_btn__audio', 'START');
    this.arrBtn = [];
    this.difficult = 1;
    this.createBtnDifficult();
  }

  createDescription() {
    this.description.node.innerHTML = `
      <div class='preview'>
        <h2>Audio Call</h2>
        <p>Captain! You need to guess the word by ear!!!</p>
      </div>
      <div class='instruction'>
        <p>You can use a mouse or keyboard</p>
      </div>
      <div class='key-instruction'>
        <p>To select a word, press:</p>
        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
      </div>
      <div class='key-instruction-two'>
        <p>To get the next card, press:</p>
        <div class='key'><span>Enter</span></div>
      </div>
    `;
  }

  private createBtnDifficult(): void {
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
