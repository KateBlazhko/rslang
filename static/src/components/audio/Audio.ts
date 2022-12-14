import Control from '../common/control';
import Logging from '../login/Logging';
import StartPageAudio from './startPage';
import GameAudio from './GameAudio';
import Signal from '../common/signal';

class Audio extends Control {
  private initiator: 'book' | 'header' = 'header';

  startPage: StartPageAudio;

  login: Logging;

  game: GameAudio;

  prevPage: string;

  bookPage: boolean;

  constructor(
    parentNode: HTMLElement | null,
    login: Logging,
    page: string,
  ) {
    super(parentNode, 'div', 'audio__container', '');
    this.login = login;
    this.bookPage = (page.split('/').length === 3) || (page.includes('difficult') || page.includes('custom'));
    this.startPage = new StartPageAudio(null, this.bookPage);
    this.prevPage = page;
    this.game = new GameAudio(this.repeatListen.bind(this), this.login);
    this.renderPage('start');
    this.startGame();
  }

  repeatListen() {
    this.node.innerHTML = '';
    this.game = new GameAudio(this.repeatListen.bind(this), this.login);
    if (this.prevPage.includes('book')) {
      const btn = this.startPage.createBtnNewGame();
      btn.node.addEventListener('click', () => {
        this.prevPage = '#audio';
      });
    }
    this.renderPage('start');
  }

  startGame() {
    this.startPage.startBtn.node.addEventListener('click', async () => {
      this.renderPage('game');

      this.game.game(`${this.startPage.difficult}`, this.prevPage);
    });
  }

  renderPage(page: 'start' | 'game') {
    this.node.innerHTML = '';
    if (page === 'start') this.startPage.render(this.node);
    else {
      this.game.render(this.node);
    }
  }
}

export default Audio;
