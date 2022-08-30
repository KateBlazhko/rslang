import { BASELINK, IWord } from '../api/Words';
import Control from '../common/control';

class CardBook extends Control {
  word: IWord;

  audio: HTMLAudioElement[];

  allAudio: HTMLAudioElement[];

  constructor(parentNode: HTMLElement | null, word: IWord, allAudio: HTMLAudioElement[]) {
    super(parentNode, 'div', 'card_item');
    this.allAudio = allAudio;
    this.word = word;
    this.audio = [];
    this.createCard();
  }

  createCard() {
    const img = new Control<HTMLImageElement>(this.node, 'img', 'img__word');
    img.node.src = `${BASELINK}/${this.word.image}`;
    const description = new Control(this.node, 'div', 'description');
    this.createTitle(description.node);
    this.createExample(description.node);
    this.createMeaning(description.node);
  }

  createTitle(node: HTMLElement) {
    const container = new Control(node, 'div', 'title');
    container.node.innerHTML = `<h3>${this.word.word}</h3><h3>${this.word.transcription}</h3><h3>${this.word.wordTranslate}</h3>`;
    const audio = new Audio(`${BASELINK}/${this.word.audio}`);
    const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    volume.node.src = '../../assets/icons/volume.png';
    volume.node.addEventListener('click', () => {
      this.allAudio.forEach((el) => el.pause());
      audio.play();
    });
    this.audio.push(audio);
  }

  createExample(node: HTMLElement) {
    const container = new Control(node, 'div', 'example');
    container.node.innerHTML = `
      <fieldset>
        <legend>Example</legend>
        ${this.word.textExample}
      </fieldset>
      <fieldset>
        <legend>Translate</legend>
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
      </fieldset>
      <fieldset>
        <legend>Translate</legend>
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
