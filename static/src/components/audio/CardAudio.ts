import { BASELINK, IWord } from '../api/Words';
import Control from '../common/control';
import { shufflePage, shuffleArrayPage, shuffleWord } from '../common/shufflePage';

class CardAudio extends Control {
  index: number;

  private containerBtn: Control<HTMLElement>;

  allWords: Array<{value: number, node: HTMLElement, word: IWord}>;

  successWord: IWord;

  constructor(
    parentNode: HTMLElement | null,
    value: { word: number },
    arrWord: Array<IWord>,
  ) {
    super(parentNode, 'div', 'audio_call__card');
    this.containerBtn = new Control(this.node, 'div', 'container_btn__audio');
    this.index = Math.floor(Math.random() * arrWord.length);
    this.successWord = arrWord[this.index];
    this.allWords = [];
    this.createCard(value, arrWord);
  }

  createCard(value: { word: number }, arrWord: Array<IWord>) {
    const volume = new Audio(`http://localhost:3000/${arrWord[this.index].audio}`);
    volume.play();
    const img = new Control<HTMLImageElement>(this.node, 'button', 'volume_button__audio');

    const allValue = shuffleWord(this.index, arrWord.length);
    img.node.addEventListener('click', () => volume.play());
    allValue.forEach((item, index) => {
      const word = new Control<HTMLButtonElement>(this.containerBtn.node, 'button', 'btn_word__audio', arrWord[item].word);
      this.allWords.push({
        node: word.node,
        value: index + 1,
        word: arrWord[item],
      });
    });
    value.word += 1;
  }
}

export default CardAudio;
