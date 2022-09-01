import Control from '../common/control';
import Logging from '../Logging';
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
    this.bookPage = (page.includes('book') && page.split('/').length === 3) || (page.includes('difficult'));
    this.startPage = new StartPageAudio(null, this.bookPage);
    this.prevPage = page;
    this.game = new GameAudio(this.repeatListen.bind(this), this.login);
    this.renderPage('start');
    this.startGame();
  }

  repeatListen() {
    this.node.innerHTML = '';
    this.game = new GameAudio(this.repeatListen.bind(this), this.login);
    this.renderPage('start');
    this.startPage.createBtnDifficult(false);
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
