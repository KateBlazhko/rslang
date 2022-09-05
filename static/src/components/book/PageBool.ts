import Words, { IUserWord, IWord } from '../api/Words';
import ButtonHref from '../common/ButtonHref';
import Control from '../common/control';
import Signal from '../common/signal';
import BASELINK from '../constants/url';
import { IStateLog } from '../login/Logging';
import stopPlayAudio from '../utils/stopPlayAudio';
import CardBook from './CardBook';
import Loader from './Loader';

const enum ButtonHrefContent {
  sprint = 'Sprint',
  audio = 'Audio'
}

class PageBook extends Control {
  page: string;

  difficult: string;

  user: IStateLog;

  audioIcons: HTMLImageElement[] = [];

  markedWords: Record<string, boolean> = {};

  words: IWord[] = [];

  arrHref: Array<ButtonHref> = [];

  constructor(
    parentNode: HTMLElement | null,
    difficult: string,
    page: string,
    user: IStateLog,
    public onAudioPlay: Signal<boolean>,
    private onDisable: Signal<boolean>,
  ) {
    super(parentNode, 'div', 'page_book_container');
    this.page = page;
    this.user = user;
    this.difficult = difficult;
    this.getWordsDb(difficult, page);
    this.onAudioPlay.add(this.disabeAudioIcons.bind(this));

    this.onMarkedWords.add(this.updateMarkedWords.bind(this));
    this.onDisable.add(this.setDisable.bind(this))
  }

  onMarkedWords = new Signal<Record<string, boolean>>();

  async getWordsDb(difficult: string, page: string) {
    const loader = new Loader(this.node);
    this.words = await Words.getWords({ group: difficult, page });
    if (this.user.state) {
      const userWords = await Words.getUserWords(this.user.userId, this.user.token);
      this.createPage(page, userWords);
    } else {
      this.createPage(page);
    }
    loader.destroy();
  }

  createPage(page: string, userWords?: IUserWord[]) {

    const paginationTop = new Control(this.node, 'div', 'pagination');
    const marked = new Control(this.node, 'div', 'marked', 'Great job! You\'ve learned everything on this page');
    this.createHrefBtn()

    const main = new Control(this.node, 'div', 'container_card');
    const paginationButton = new Control(this.node, 'div', 'pagination');
    this.createPagination(paginationTop.node, page);
    this.createPagination(paginationButton.node, page);
    this.createCards(main.node, userWords);

    this.checkCards();
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

  createCards(main: HTMLElement, userWords?: IUserWord[]) {
    this.words.forEach((word) => {
      const sounds = [
        `${BASELINK}/${word.audio}`,
        `${BASELINK}/${word.audioMeaning}`,
        `${BASELINK}/${word.audioExample}`,
      ];
      const card = new CardBook(
        main,
        word,
        sounds,
        this.user,
        this.onAudioPlay,
        this.onMarkedWords,
      );

      this.audioIcons.push(...card.audio);

      if (userWords) {
        const userWord = userWords.find((item) => item.optional.wordId === word.id);
        if (userWord) {
          const isMarked = !!((
            userWord.optional.isLearn
            || userWord.difficulty === 'hard'
          ));

          this.markedWords = {
            ...this.markedWords,
            [word.id]: isMarked,
          };
        }
        if (this.user.state) {
          card.addUserFunctional(word, userWords);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.user.state) {
          card.addUserFunctional(word);
        }
      }
    });
  }

  checkCards() {
    const countMarkedWords = Object.values(this.markedWords).filter((item) => item === true).length;
    if (this.words.length === countMarkedWords) {
      this.node.classList.add('all-check');
      this.onDisable.emit(true);
    } else {
      this.node.classList.remove('all-check');
      this.onDisable.emit(false);
    }
  }

  updateMarkedWords(item: Record<string, boolean>) {
    this.markedWords = {
      ...this.markedWords,
      ...item,
    };
    console.log();
    this.checkCards();
  }

  disabeAudioIcons(onAudioPlay: boolean) {
    if (onAudioPlay) {
      stopPlayAudio(this.audioIcons, 'none');
    } else {
      stopPlayAudio(this.audioIcons, 'auto');
    }
  }

  createPagination(pagination: HTMLElement, page: string) {
    const prev = new Control<HTMLAnchorElement>(pagination, 'a', 'arrow');

    let prevPages = 0;

    if (+page <= 2) {
      prevPages = 1;
    } else if (+page >= 3) {
      prevPages = +page - 1;
    }

    let nextPages = prevPages + 5;

    if (prevPages === 27) {
      prevPages -= 1;
      nextPages = prevPages + 5;
    }
    if (prevPages > 27) {
      prevPages -= 2;
      nextPages = prevPages + 5;
    }

    for (let i = prevPages; i < nextPages; i += 1) {
      const item = new Control<HTMLAnchorElement>(pagination, 'a', 'page_number', `${i}`);
      item.node.href = `#book/${this.difficult}/${i - 1}`;
      if (+page === i - 1) item.node.classList.add('active');
    }

    const next = new Control<HTMLAnchorElement>(pagination, 'a', 'arrow');
    prev.node.href = `#book/${this.difficult}/${+page > 0 ? +page - 1 : 0}`;
    next.node.href = `#book/${this.difficult}/${+page < 29 ? +page + 1 : 29}`;
  }
}

export default PageBook;
