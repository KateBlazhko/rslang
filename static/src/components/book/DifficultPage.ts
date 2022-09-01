import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import { IStateLog } from '../Logging';
import CardBook from './CardBook';
import Loader from './Loader';

interface ICardDifficult {
  node: CardBook,
  item: IWord
}
class DifficultPage extends Control {
  user: IStateLog;

  allCards: ICardDifficult[];

  constructor(parentNode: HTMLElement | null, user: IStateLog) {
    super(parentNode, 'div', 'page_book_container');
    this.user = user;
    this.allCards = [];
    this.createPage(user);
  }

  async createCards(main: HTMLElement, words: IWord[]) {
    const allAudio: HTMLAudioElement[] = [];
    const userWords = await Words.getUserWords(this.user.userId, this.user.token);
    words.forEach((word) => {
      const card = new CardBook(main, word, allAudio, this.user);
      card.difficultListen();
      this.allCards.push({ node: card, item: word });
      allAudio.push(...card.audio);
      card.addUserFunctional(word, userWords);
    });
  }

  // listenMain(event: HTMLElement, arr: ICardDifficult[]) {
  //   if (event.tagName === 'BUTTON') {
  //     console.log(event)
  //   }
  // }

  async createPage(user: IStateLog) {
    const loader = new Loader(this.node);
    const main = new Control(this.node, 'div', 'container_card');
    const arr = await this.getWords(user);
    this.createCards(main.node, arr as unknown as IWord[]);
    if (arr.length === 0) main.node.innerHTML = '<h1 class="no_cards">Вы еще не добавили сложные слова!!!</h1>';
    loader.destroy();
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
