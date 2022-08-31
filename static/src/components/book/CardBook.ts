import Words, { BASELINK, IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import { IStateLog } from '../Logging';

class CardBook extends Control {
  word: IWord;

  audio: HTMLAudioElement[];

  allAudio: HTMLAudioElement[];

  description: Control<HTMLElement>;

  user: IStateLog;

  constructor(
    parentNode: HTMLElement | null,
    word: IWord,
    allAudio: HTMLAudioElement[],
    user: IStateLog,
  ) {
    super(parentNode, 'div', 'card_item');
    this.user = user;
    this.allAudio = allAudio;
    this.word = word;
    this.audio = [];
    this.description = new Control(this.node, 'div', 'description');
    this.createCard();
  }

  createCard() {
    const img = new Control<HTMLImageElement>(this.node, 'img', 'img__word');
    img.node.src = `${BASELINK}/${this.word.image}`;
    const { description } = this;
    this.createTitle(description.node);
    this.createExample(description.node);
    this.createMeaning(description.node);
  }

  createTitle(node: HTMLElement) {
    const container = new Control(node, 'div', 'title');
    container.node.innerHTML = `<h3 class="en">${this.word.word}</h3><h3>${this.word.transcription}</h3><h3>${this.word.wordTranslate}</h3>`;
    const audio = new Audio(`${BASELINK}/${this.word.audio}`);
    const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    volume.node.src = '../../assets/icons/volume.png';
    volume.node.addEventListener('click', () => {
      this.allAudio.forEach((el) => el.pause());
      audio.play();
    });
    this.audio.push(audio);
  }

  // eslint-disable-next-line class-methods-use-this
  createDifficultBtn(node: HTMLElement, userWord?: IUserWord) {
    const button = new Control(node, 'button', 'button_difficult', 'Difficult');
    if (userWord && userWord.difficulty === 'hard') {
      button.node.textContent = 'Delete';
    }
    button.node.addEventListener('click', () => {
      if (userWord) {
        if (userWord.difficulty === 'easy') {
          button.node.textContent = 'Delete';
          const word = userWord;
          word.difficulty = 'hard';
          Words.updateUserWord(this.user.userId, this.user.token, userWord.optional.wordId, word);
        }
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  createStudiedBtn(node: HTMLElement, userWord?: IUserWord) {
    const button = new Control(node, 'button', 'button_studied', 'Studied');
    button.node.addEventListener('click', () => {

    });
  }

  addUserFunctional(userWord?: IUserWord) {
    const containerBtn = new Control(this.description.node, 'div', 'container-btn');
    this.createDifficultBtn(containerBtn.node, userWord);
    this.createStudiedBtn(containerBtn.node, userWord);
  }
  // studied

  createExample(node: HTMLElement) {
    const container = new Control(node, 'div', 'example');
    container.node.innerHTML = `
      <fieldset>
        <legend>Example</legend>
        ${this.word.textExample}
        <br>
        ${this.word.textExampleTranslate}
      </fieldset>
    `;
    const audio = new Audio(`${BASELINK}/${this.word.audioExample}`);
    const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    volume.node.src = '../../assets/icons/volume.png';
    volume.node.addEventListener('click', () => {
      this.allAudio.forEach((el) => el.pause());
      audio.play();
    });
    this.audio.push(audio);
  }

  createMeaning(node: HTMLElement) {
    const container = new Control(node, 'div', 'example');
    container.node.innerHTML = `
      <fieldset>
        <legend>Meaning</legend>
        ${this.word.textMeaning}
        <br>
        ${this.word.textMeaningTranslate}
      </fieldset>
  
    `;
    const audio = new Audio(`${BASELINK}/${this.word.audioMeaning}`);
    const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    volume.node.src = '../../assets/icons/volume.png';
    volume.node.addEventListener('click', () => {
      this.allAudio.forEach((el) => el.pause());
      audio.play();
    });
    this.audio.push(audio);
  }
}

export default CardBook;
