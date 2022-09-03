import { WebpackOptionsDefaulter } from '../../../node_modules/webpack/types';
import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import Signal from '../common/signal';
import BASELINK from '../constants/url';
import { IStateLog } from '../login/Logging';
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

  words: IWord[] = []

  main: Control | null = null

  constructor(
    parentNode: HTMLElement | null,
    user: IStateLog,
    public onAudioPlay: Signal<boolean>,
  ) {
    super(parentNode, 'div', 'page_book_container');
    this.user = user;
    this.allCards = [];
    this.createPage(user);
    this.onAudioPlay.add(this.disabeAudioIcons.bind(this));
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
      card.onDeleteWord.add(this.checkIsEmpty.bind(this))

      card.difficultListen(word.id);
      this.allCards.push({ node: card, item: word });
      this.audioIcons.push(...card.audio);
      card.addUserFunctional(word, userWords);
    });
  }

  async createPage(user: IStateLog) {
    const loader = new Loader(this.node);
    this.main = new Control(this.node, 'div', 'container_card');
    this.words = await this.getWords(user);
    this.createCards(this.main.node, this.words);
    this.checkIsEmpty()
    loader.destroy();
  }

  checkIsEmpty(id?: string) {
    if (id) {
      this.words = this.words.filter(item => item.id !== id)
    }
    
    if (this.words.length === 0) {
      if (this.main)
        this.main.node.innerHTML = '<span class="no_cards">You haven\'t added difficult words yet!!!</span>';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getWords(user: IStateLog) {
    const res = await Words.getDifficultyWords(user);
    const newArr = Words.adapterAggregatedWords(res)
    return newArr;
  }

  disabeAudioIcons(onAudioPlay: boolean) {
    if (onAudioPlay) {
      stopPlayAudio(this.audioIcons, 'none');
    } else {
      stopPlayAudio(this.audioIcons, 'auto');
    }
  }
}

export default DifficultPage;
