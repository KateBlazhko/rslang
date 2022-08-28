import Control from '../common/control';
import Logging from '../Logging';
import StartPageAudio from './startPage';
import '../../style/audio.scss';
import Words from '../api/Words';
import GameAudio from './GameAudio';
import Signal from '../common/signal';

class Audio extends Control {
  private initiator: 'book' | 'header' = 'header';

  startPage: StartPageAudio;

  login: Logging;

  game: GameAudio;

  constructor(
    parentNode: HTMLElement | null,
    login: Logging,
    private onGoBook: Signal<string>,
  ) {
    super(parentNode, 'div', 'audio__container', '');
    this.login = login;
    this.startPage = new StartPageAudio(null);
    this.game = new GameAudio(this.repeatListen.bind(this), this.login);
    onGoBook.add(this.setInitiator.bind(this));

    this.renderPage('start');
    this.startGame();
  }

  public setInitiator(page: string) {
    this.initiator = page === 'book' ? 'book' : 'header';
  }

  public getInitiator(): 'book' | 'header' {
    return this.initiator;
  }

  repeatListen() {
    this.node.innerHTML = '';
    this.game = new GameAudio(this.repeatListen.bind(this), this.login);
    this.renderPage('start');
  }

  startGame() {
    this.startPage.startBtn.node.addEventListener('click', async () => {
      this.renderPage('game');

      this.game.game(`${this.startPage.difficult}`, this.getInitiator());
    });
  }

  renderPage(page: 'start' | 'game') {
    this.node.innerHTML = '';
    if (page === 'start') this.startPage.render(this.node);
    else this.game.render(this.node);
  }
}

export default Audio;
