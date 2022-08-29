import Control from '../common/control';
import Logging, { IStateLog } from '../Logging';
import '../../style/book.scss';
import PageBook from './PageBool';

class Book extends Control {
  login: Logging;

  hash: string;

  constructor(
    parentNode: HTMLElement | null,
    login: Logging,
    hash: string,
  ) {
    super(parentNode, 'div', 'book_container');
    this.login = login;
    this.hash = hash;
    this.createPage(hash);
  }

  createHrefBtn(user: IStateLog) {
    const container = new Control(this.node, 'div', 'container_difficult');
    container.node.innerHTML = `
      <a href="#book/0/0">A1</a>
      <a href="#book/1/0">A2</a>
      <a href="#book/2/0">B1</a>
      <a href="#book/3/0">B2</a>
      <a href="#book/4/0">C1</a>
      <a href="#book/5/0">C2</a>
      ${user.state ? '<a href="#book/6/0">difficult words</a>' : ''}
    `;
  }

  async createPage(hash: string) {
    const user = await this.login.checkStorageLogin();
    this.node.innerHTML = '';
    const itemHash = hash.split('/');
    const difficult = /^[0-5]+$/;
    const page = /^[0-29]+$/;
    if (difficult.test(itemHash[1]) && page.test(itemHash[2])) {
      const newPage = new PageBook(this.node, itemHash[1], itemHash[2], user);
    } else {
      this.createHrefBtn(user);
    }
  }
}

export default Book;
