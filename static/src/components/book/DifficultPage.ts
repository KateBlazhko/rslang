import Words, { IWord } from '../api/Words';
import ButtonHref from '../common/ButtonHref';
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

const enum ButtonHrefContent {
  sprint = 'Sprint',
  audio = 'Audio'
}

class DifficultPage extends Control {
  user: IStateLog;

  allCards: ICardDifficult[];

  audioIcons: HTMLImageElement[] = [];

  words: IWord[] = []

  main: Control | null = null

  arrHref: Array<ButtonHref> = [];

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
    this.createHrefBtn()
    this.main = new Control(this.node, 'div', 'container_card');
    this.words = await this.getWords(user);
    this.createCards(this.main.node, this.words);
    this.checkIsEmpty()
    loader.destroy();
  }

  createHrefBtn() {
    const container = new Control(this.node, 'div', 'page__button-side-wrap');
    container.node.innerHTML = `
      <a class="page__button-side" href="#book/0/0">A1</a>
      <a class="page__button-side" href="#book/1/0">A2</a>
      <a class="page__button-side" href="#book/2/0">B1</a>
      <a class="page__button-side" href="#book/3/0">B2</a>
      <a class="page__button-side" href="#book/4/0">C1</a>
      <a class="page__button-side" href="#book/5/0">C2</a>
      ${this.user.state ? '<a class="page__button-side" href="#book/difficult">A</a>' : ''}
    `;

    const sprint = new ButtonHref(container.node, '#sprint', ButtonHrefContent.sprint);
    const audio = new ButtonHref(container.node, '#audio', ButtonHrefContent.audio);

    this.arrHref = [sprint, audio];
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
