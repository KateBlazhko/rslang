import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import { shufflePage, shuffleArrayPage } from '../common/shufflePage';
import CardAudio from './CardAudio';

class GameAudio extends Control {
  arrWords: IWord[];

  value: { word: number; };

  progress: Control<HTMLElement>;

  constructor() {
    super(null, 'div', 'game__page__audio');
    this.progress = new Control(this.node, 'div', 'audio_call__progress');
    this.arrWords = [];
    this.value = { word: 0 };
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
    if (prev) prev.destroy();
    const card = new CardAudio(this.node, this.value, this.arrWords);
    card.allWords.forEach((item) => {
      item.node.addEventListener('click', () => {
        if (item.word.id === card.successWord.id) {
          this.value.word += 1;
          this.arrWords.splice(card.index, 1);
          this.createCard(card);
        }
      });
    });
  }

  render(node: HTMLElement) {
    node.append(this.node);
  }
}

export default GameAudio;
