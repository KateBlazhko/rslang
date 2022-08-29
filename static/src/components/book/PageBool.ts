import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import { IStateLog } from '../Logging';

class PageBook extends Control {
  constructor(
    parentNode: HTMLElement | null,
    difficult: string,
    page: string,
    user: IStateLog,
  ) {
    super(parentNode, 'div', 'page_book_container');
    this.getWordsDb(difficult, page);
  }

  async getWordsDb(difficult: string, page: string) {
    const words = await Words.getWords({ group: difficult, page });
    this.createPage(words);
  }

  createPage(words: IWord[]) {
    const main = new Control(this.node, 'div', 'container_card');
    const pagination = new Control(this.node, 'div', 'pagination');
  }
}

export default PageBook;
