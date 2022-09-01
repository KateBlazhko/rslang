import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import { IStateLog } from '../Logging';
import CardBook from './CardBook';

class DifficultPage extends Control {
  user: IStateLog;

  constructor(parentNode: HTMLElement | null, user: IStateLog) {
    super(parentNode, 'div', 'difficult-page');
    this.user = user;
    // this.createPage(user);
  }

  createCards(main: HTMLElement, words: IWord[]) {
    const allAudio: HTMLAudioElement[] = [];
    words.forEach((word) => {
      const card = new CardBook(main, word, allAudio, this.user);
      allAudio.push(...card.audio);
      card.addUserFunctional(word);
    });
  }

  async createPage(user: IStateLog) {
    const arr = await this.getWords(user);
    this.createCards(this.node, arr as unknown as IWord[]);
  }

  // eslint-disable-next-line class-methods-use-this
  async getWords(user: IStateLog) {
    const res = await Words.getDifficultyWords(user);
    const newArr = res.map((item) => {
      Object.defineProperty(item, 'id', {
        value: item._id, configurable: true, enumerable: true, writable: true,
      });
      return item;
    });
    return newArr;
  }
}

export default DifficultPage;
