import Words, { IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import { IStateLog } from '../Logging';
import CardBook from './CardBook';

class PageBook extends Control {
  page: string;

  difficult: string;

  user: IStateLog;

  constructor(
    parentNode: HTMLElement | null,
    difficult: string,
    page: string,
    user: IStateLog,
  ) {
    super(parentNode, 'div', 'page_book_container');
    this.page = page;
    this.user = user;
    this.difficult = difficult;
    this.getWordsDb(difficult, page);
  }

  async getWordsDb(difficult: string, page: string) {
    const words = await Words.getWords({ group: difficult, page });
    if (this.user.state) {
      const userWords = await Words.getUserWords(this.user.userId, this.user.token);
      this.createPage(words, page, userWords);
    } else {
      this.createPage(words, page);
    }
  }

  createPage(words: IWord[], page: string, userWords?: IUserWord[]) {
    const paginationTop = new Control(this.node, 'div', 'pagination');
    const main = new Control(this.node, 'div', 'container_card');
    const paginationButton = new Control(this.node, 'div', 'pagination');

    this.createPagination(paginationTop.node, page);
    this.createPagination(paginationButton.node, page);

    this.createCards(main.node, words, userWords);
  }

  // eslint-disable-next-line class-methods-use-this
  createCards(main: HTMLElement, words: IWord[], userWords?: IUserWord[]) {
    const allAudio: HTMLAudioElement[] = [];
    words.forEach((word) => {
      const card = new CardBook(main, word, allAudio, this.user);
      allAudio.push(...card.audio);
      if (userWords) {
        card.addUserFunctional(word, userWords);
      } else {
        card.addUserFunctional(word);
      }
    });
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
