import Control from '../common/control';
import Logging, { IStateLog } from '../Logging';
import addClassOnPage from '../utils/freeClass';
import DifficultPage from './DifficultPage';
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
      <a href="#book/0/0">Beginner A1</a>
      <a href="#book/1/0">Elementary A2</a>
      <a href="#book/2/0">Pre-Intermidiate B1</a>
      <a href="#book/3/0">Intermidiate B2</a>
      <a href="#book/4/0">Pre-Advanced C1</a>
      <a href="#book/5/0">Advanced C2</a>
      ${user.state ? '<a href="#book/difficult">difficult words</a>' : ''}
    `;
  }

  async createPage(hash: string) {
    const user = await this.login.checkStorageLogin();
    this.node.innerHTML = '';
    const itemHash = hash.split('/');
    const difficult = /^[0-5]+$/;
    const page = /^[0-29]+$/;
    if (itemHash[1] && itemHash[2]) {
      const newPage = new PageBook(this.node, itemHash[1], itemHash[2], user);
      addClassOnPage(newPage.node, +itemHash[1]);
    } else if (itemHash[1] === 'difficult') {
      const newPage = new DifficultPage(this.node, user);
    } else {
      this.createHrefBtn(user);
    }
  }
}

export default Book;
