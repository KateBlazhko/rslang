import Sprint from '../sprint/sprint';
import Signal from '../common/signal';
import Control from '../common/control';
import HomePage from '../home/homePage';
import Logging from '../Logging';
import Audio from '../audio/Audio';
import About from '../about/about';

class Router {
  private location: Location;

  private currentPage: Control | Sprint | HomePage | null = null;

  private container: Control;

  constructor(private login: Logging) {
    this.container = new Control(document.body, 'main', 'page');
    this.location = window.location;
    this.setPage(this.location.hash.slice(1));
    this.hashChange();
  }

  public onGoPage = new Signal<string>();

  private hashChange() {
    window.addEventListener('hashchange', () => {
      if (this.currentPage) this.currentPage.destroy();
      this.setPage(this.location.hash.slice(1));
    });
  }

  private setPage(hash: string) {
    const container = this.container.node;

    if (hash) {
      this.onGoPage.emit(hash);
    }

    switch (hash) {
      case 'home':
        container.innerHTML = '';
        this.currentPage = new HomePage(container, this.login);
        break;
      case 'about':
        this.onGoPage.emit(hash);
        this.currentPage = new About(container, this.login, this.onGoPage);
        break;
      case 'book':
        container.innerHTML = '<h1>Book</h1>';
        break;
      case 'sprint':
        this.onGoPage.emit(hash);
        this.currentPage = new Sprint(container, this.login, this.onGoPage);
        break;
      case 'audio':
        this.onGoPage.emit(hash);
        this.currentPage = new Audio(container, this.login, this.onGoPage);
        break;
      case 'statistics':
        container.innerHTML = '<h1>statistics</h1>';
        break;
      default:
        this.onGoPage.emit('home');
        container.innerHTML = '';
        this.currentPage = new HomePage(container, this.login);
    }
  }

  render() {
    return this.container.node;
  }
}

export default Router;
