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

  words: IWord[] = [];

  main: Control | null = null;

  arrHref: Array<ButtonHref> = [];

  constructor(
    parentNode: HTMLElement | null,
    user: IStateLog,
    public onAudioPlay: Signal<boolean>,
    private onDisable: Signal<boolean>,
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

      const card = new CardBook(main, word, sounds, this.user, BASELINK, this.onAudioPlay);
      card.onDeleteWord.add(this.checkIsEmpty.bind(this));

      card.difficultListen(word.id);
      this.allCards.push({ node: card, item: word });
      this.audioIcons.push(...card.audio);
      card.addUserFunctional(word, userWords);
    });
  }

  async createPage(user: IStateLog) {
    const loader = new Loader(this.node);
    this.createHrefBtn();
    this.main = new Control(this.node, 'div', 'container_card');
    this.words = await this.getWords(user);
    this.createCards(this.main.node, this.words);
    this.checkIsEmpty();
    loader.destroy();
  }

  createHrefBtn() {
    const container = new Control(this.node, 'div', 'page__button-side-wrap');
    const returnHref = new ButtonHref(container.node, '#book', '', 'page__button-side');
    const sprintHref = new ButtonHref(container.node, '#sprint', ButtonHrefContent.sprint, 'page__button-side');
    const audioHref = new ButtonHref(container.node, '#audio', ButtonHrefContent.audio, 'page__button-side');

    this.arrHref = [sprintHref, audioHref];
  }

  setDisable(isDisable: boolean) {
    if (isDisable) {
      this.arrHref.forEach((button) => {
        button.node.classList.add('disable');
      });
    } else {
      this.arrHref.forEach((button) => {
        button.node.classList.remove('disable');
      });
    }
  }

  checkIsEmpty(id?: string) {
    if (id) {
      this.words = this.words.filter((item) => item.id !== id);
    }

    if (this.words.length === 0) {
      if (this.main) this.main.node.innerHTML = '<span class="no_cards">You haven\'t added difficult words yet</span>';
      this.setDisable(true);
      this.onDisable.emit(true);
    } else {
      this.onDisable.emit(false);
      this.setDisable(false);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getWords(user: IStateLog) {
    const res = await Words.getDifficultyWords(user);
    const newArr = Words.adapterAggregatedWords(res);
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
