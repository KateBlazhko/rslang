import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import Signal from '../common/signal';
import BASELINK from '../constants/url';
import { IStateLog } from '../Logging';
import stopPlayAudio from '../utils/stopPlayAudio';
import CardBook from './CardBook';
import Loader from './Loader';

interface ICardDifficult {
  node: CardBook,
  item: IWord
}
class DifficultPage extends Control {
  user: IStateLog;

  allCards: ICardDifficult[];

  audioIcons: HTMLImageElement[] = [];


  constructor(
    parentNode: HTMLElement | null, 
    user: IStateLog,
    public onAudioPlay: Signal<boolean>
  ) {
    super(parentNode, 'div', 'page_book_container');
    this.user = user;
    this.allCards = [];
    this.createPage(user);
    this.onAudioPlay.add(this.disabeAudioIcons.bind(this))
  }

  async createCards(main: HTMLElement, words: IWord[]) {

    const userWords = await Words.getUserWords(this.user.userId, this.user.token);
    words.forEach((word) => {

      const sounds = [
        `${BASELINK}/${word.audio}`,
        `${BASELINK}/${word.audioMeaning}`,
        `${BASELINK}/${word.audioExample}`,
      ];

      const card = new CardBook(main, word, sounds, this.user, this.onAudioPlay);
      card.difficultListen();
      this.allCards.push({ node: card, item: word });
      this.audioIcons.push(...card.audio);
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
    if (arr.length === 0) main.node.innerHTML = `<span class="no_cards">You haven't added difficult words yet!!!</span>`;
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

  disabeAudioIcons(onAudioPlay: boolean) {
    if (onAudioPlay) {
      stopPlayAudio(this.audioIcons, "none");
    } else {
      stopPlayAudio(this.audioIcons, "auto");
    }
  }
}

export default DifficultPage;
