import Control from '../common/control';
import Logging from '../Logging';
import StartPageAudio from './startPage';
import '../../style/audio.scss';
import Words from '../api/Words';
import GameAudio from './GameAudio';

class Audio extends Control {
  startPage: StartPageAudio;

  login: Logging;

  game: GameAudio;

  constructor(
    parentNode: HTMLElement | null,
    login: Logging,
  ) {
    super(parentNode, 'div', 'audio__container', '');
    this.login = login;
    this.startPage = new StartPageAudio(null);
    this.game = new GameAudio(this.repeatListen.bind(this));
    this.renderPage('start');
    this.startGame();
  }

  repeatListen() {
    this.node.innerHTML = '';
    this.game = new GameAudio(this.repeatListen.bind(this));
    this.renderPage('start');
  }

  startGame() {
    this.startPage.startBtn.node.addEventListener('click', async () => {
      this.renderPage('game');
      this.game.game(`${this.startPage.difficult}`);
    });
  }

  renderPage(page: 'start' | 'game') {
    this.node.innerHTML = '';
    if (page === 'start') this.startPage.render(this.node);
    else this.game.render(this.node);
  }
}

export default Audio;
