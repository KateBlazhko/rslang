import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import { shufflePage, shuffleArrayPage } from '../common/shufflePage';
import CardAudio from './CardAudio';
import StatisticAudio from './StatisticAudio';

class GameAudio extends Control {
  arrWords: IWord[];

  value: { word: number; };

  progress: Control<HTMLElement>;

  arrWordsStatus: Array<{word: IWord, status: 'failed' | 'success'}>;

  constructor() {
    super(null, 'div', 'game__page__audio');
    this.progress = new Control(this.node, 'div', 'audio_call__progress', 'Your Progress');
    this.arrWords = [];
    this.arrWordsStatus = [];
    this.value = { word: 0 };
    this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
  }

  static async getAllWords(difficult: string) {
    const wordsAll = await Promise.all(shufflePage().map((page) => Words.getWords({
      group: difficult,
      page: page.toString(),
    })));
    return shuffleArrayPage(wordsAll.flat());
  }

  async game(difficult: string) {
    this.arrWords = await GameAudio.getAllWords(difficult);
    this.createCard();
  }

  createCard(prev?: CardAudio) {
    const success = new Audio('../../assets/sound/ok.mp3');
    const fail = new Audio('../../assets/sound/fail.mp3');

    if (prev) prev.destroy();
    const card = new CardAudio(this.node, this.value, this.arrWords);
    card.allWords.forEach((item) => {
      item.node.addEventListener('click', () => {
        if (item.word.id === card.successWord.id) {
          this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
          item.node.classList.add('success');
          this.arrWordsStatus.push({ word: item.word, status: 'success' });
          success.play();
        } else {
          this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
          item.node.classList.add('failed');
          fail.play();
          this.arrWordsStatus.push({ word: item.word, status: 'failed' });
        }
        card.allWords.forEach((node) => { node.node.disabled = true; });
        if (this.value.word < 20) {
          this.buttonNext(card);
        } else {
          this.viewStatistic(card);
        }
      });
    });
  }

  viewStatistic(prev?: CardAudio) {
    if (prev) prev.destroy();
    this.progress.destroy();
    const statistic = new StatisticAudio(this.node, this.arrWordsStatus);
  }

  buttonNext(card: CardAudio) {
    const button = new Control(null, 'button', 'button_next', 'NEXT');
    card.node.prepend(button.node);
    button.node.addEventListener('click', () => {
      this.arrWords.splice(card.index, 1);
      this.createCard(card);
      button.destroy();
    });
  }

  render(node: HTMLElement) {
    node.append(this.node);
  }
}

export default GameAudio;
