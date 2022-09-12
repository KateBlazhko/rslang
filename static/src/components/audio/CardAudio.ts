import { IWord } from '../api/Words';
import Control from '../common/control';
import { randomWord } from '../common/shufflePage';
import BASELINK from '../constants/url';

class CardAudio extends Control {
  private containerBtn: Control<HTMLElement>;

  resultWords: Array<{value: number, node: HTMLButtonElement, word: IWord}>;

  volumeContainer: Control<HTMLElement>;

  arrWord: IWord[];

  arrReqWord: { word: IWord; status: boolean; }[];

  words: { successWord: IWord; allWords: IWord[]; };

  randomWords: IWord[];

  constructor(
    parentNode: HTMLElement | null,
    value: { word: number },
    arrWord: Array<IWord>,
    arrReqWord: { word: IWord; status: boolean;}[],
    randomWords: IWord[],
  ) {
    super(parentNode, 'div', 'audio_call__card');
    this.volumeContainer = new Control(this.node, 'div', 'container__volume');
    this.containerBtn = new Control(this.node, 'div', 'container_btn__audio');
    this.resultWords = [];
    this.randomWords = randomWords;
    this.arrWord = arrWord;
    this.arrReqWord = arrReqWord;
    this.words = this.createWords();
    this.createCard(value);
  }

  viewCard() {
    const container = new Control(this.volumeContainer.node, 'div', 'content');
    container.node.innerHTML += `
    <div class="image_preview">
      <img src='${BASELINK}/${this.words.successWord.image}'>
      <h3>${this.words.successWord.word} <span><h3>${this.words.successWord.transcription}</h3></span></h3>
    </div>
    <div class='example'>
      <fieldset>
        <legend>Example</legend>
        ${this.words.successWord.textExample}
      </fieldset>
      <fieldset>
        <legend>Translate</legend>
        ${this.words.successWord.textExampleTranslate}
      </fieldset>
    </div>
    `;
  }

  createWords() {
    // const idWords = this.arrReqWord.map((el) => el.word.id);
    const res: IWord[] = [];
    while (res.length < 5) {
      const item = this.randomWords[Math.floor(Math.random() * this.randomWords.length)];
      const resId = res.map((el) => el.id);
      if (!resId.includes(item.id)) {
        res.push(item);
      }
    }
    const successWord = this.getSuccessWord();
    res.push(successWord);
    const resObj = {
      successWord, allWords: randomWord(res),
    };

    return resObj;
  }

  getSuccessWord() {
    const idWords = this.arrReqWord.map((el) => el.word.id);
    let bool = true;
    let success = this.arrWord[Math.floor(Math.random() * this.arrWord.length)];
    while (bool) {
      if (idWords.includes(success.id)) {
        success = this.arrWord[Math.floor(Math.random() * this.arrWord.length)];
      } else {
        bool = false;
      }
    }

    return success;
  }

  createCard(value: { word: number }) {
    const volume = new Audio(`${BASELINK}/${this.words.successWord.audio}`);
    volume.play();
    const img = new Control<HTMLImageElement>(this.volumeContainer.node, 'button', 'volume_button__audio');

    img.node.addEventListener('click', () => volume.play());
    this.words.allWords.forEach((item, index) => {
      const word = new Control<HTMLButtonElement>(this.containerBtn.node, 'button', 'button');
      const number = new Control<HTMLSpanElement>(word.node, 'span', 'button__number', `${index + 1}`);
      const text = new Control<HTMLSpanElement>(word.node, 'span', 'button__text', item.wordTranslate);

      // word.node.prepend(number.node);
      this.resultWords.push({
        node: word.node,
        value: index + 1,
        word: item,
      });
    });
    value.word += 1;
  }
}

export default CardAudio;
