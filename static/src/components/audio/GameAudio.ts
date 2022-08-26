import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import { shufflePage, shuffleArrayPage } from '../common/shufflePage';
import CardAudio from './CardAudio';

class GameAudio extends Control {
  arrWords: IWord[];

  value: { word: number; };

  constructor() {
    super(null, 'div', 'game__page__audio');
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
    this.arrWords = (await GameAudio.getAllWords(difficult));

    // console.log(this.arrWords)
  }

  createCard() {
    const card = new CardAudio(this.node, this.value, this.arrWords);
    this.arrWords.push();
  }

  render(node: HTMLElement) {
    node.append(this.node);
  }
}

export default GameAudio;
