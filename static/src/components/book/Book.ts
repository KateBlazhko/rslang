import Control from '../common/control';
import Signal from '../common/signal';
import Logging, { IStateLog } from '../login/Logging';
import addClassOnPage from '../utils/freeClass';
import CustomPage from './CustomPage';
import DifficultPage from './DifficultPage';
import PageBook from './PageBool';

class Book extends Control {
  login: Logging;

  hash: string;

  constructor(
    parentNode: HTMLElement | null,
    login: Logging,
    hash: string,
    private onDisable: Signal<boolean>,
  ) {
    super(parentNode, 'div', 'book_container');
    this.login = login;
    this.hash = hash;
    this.createPage(hash);
  }

  public onAudioPlay = new Signal<boolean>();

  createHrefBtn(user: IStateLog) {
    const container = new Control(this.node, 'div', 'container_difficult');
    container.node.innerHTML = `
      <a href="#book/0/0">Beginner A1</a>
      <a href="#book/1/0">Elementary A2</a>
      <a href="#book/2/0">Pre-Intermidiate B1</a>
      <a href="#book/3/0">Intermidiate B2</a>
      <a href="#book/4/0">Pre-Advanced C1</a>
      <a href="#book/5/0">Advanced C2</a>
      ${user.state ? '<a href="#book/difficult">Difficult words</a>' : ''}
      ${user.state ? '<a href="#book/custom">Custom words</a>' : ''}
    `;
  }

  async createPage(hash: string) {
    const user = await this.login.checkStorageLogin();
    this.node.innerHTML = '';
    const itemHash = hash.split('/');
    const difficult = /^[0-5]+$/;
    const page = /^[0-29]+$/;
    if (itemHash[1] && itemHash[2]) {
      const newPage = new PageBook(
        this.node,
        itemHash[1],
        itemHash[2],
        user,
        this.onAudioPlay,
        this.onDisable,
      );
      addClassOnPage(newPage.node, +itemHash[1]);
    } else if (itemHash[1] === 'difficult') {
      const newPage = new DifficultPage(this.node, user, this.onAudioPlay, this.onDisable);
      newPage.node.classList.add('difficult');
    } else if (itemHash[1] === 'custom') {
      const newPage = new CustomPage(this.node, user, this.onAudioPlay, this.onDisable);
      newPage.node.classList.add('custom');
    } else {
      this.createHrefBtn(user);
    }
  }

  destroy(): void {
    this.onAudioPlay.emit(false)
    super.destroy()
  }
}

export default Book;
