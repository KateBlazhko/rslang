import Sprint from '../sprint/sprint';
import Statistic from '../stat/statistic';
import Signal from '../common/signal';
import Control from '../common/control';
import HomePage from '../home/homePage';
import Logging from '../login/Logging';
import Audio from '../audio/Audio';
import AboutPage from '../about/aboutPage';
import Book from '../book/Book';
import Validator from '../utils/Validator';

class Router {
  private location: Location;

  private currentPage: Control | Sprint | HomePage | null = null;

  private container: Control;

  prevPage: { page: string; };

  constructor(private login: Logging) {
    this.container = new Control(document.body, 'main', 'page');
    this.prevPage = { page: '' };
    this.location = window.location;
    this.setPage(this.location.hash.slice(1));
    this.hashChange();
    this.login.getEvent(this.listenLogin.bind(this));
  }

  listenLogin() {
    if (this.currentPage) this.currentPage.destroy();
    this.setPage(this.location.hash.slice(1));
  }

  public onGoPage = new Signal<string>();

  public onDisable = new Signal<boolean>();

  private hashChange() {
    window.addEventListener('hashchange', () => {
      if (this.currentPage) this.currentPage.destroy();
      this.setPage(this.location.hash.slice(1));
      this.prevPage.page = window.location.hash;
    });
  }

  private setPage(hash: string) {
    const { page } = this.prevPage;
    const container = this.container.node;
    this.onDisable.emit(false);

    if (hash) {
      this.onGoPage.emit(hash);
    }

    if (hash.includes('book')) {
      this.onGoPage.emit(hash);
      this.currentPage = new Book(container, this.login, hash, this.onDisable);
    }

    if (window.location.hash.length === 0) {
      window.location.hash = '#home';
    }

    switch (hash) {
      case 'home':
        this.currentPage = new HomePage(container, this.login);
        break;
      case 'about':
        this.currentPage = new AboutPage(container);

        break;
      case 'sprint':
        this.onGoPage.emit(hash);
        this.currentPage = new Sprint(container, this.login, this.prevPage);
        break;
      case 'audio':
        this.onGoPage.emit(hash);
        this.currentPage = new Audio(container, this.login, page);
        break;
      case 'statistics':
        this.currentPage = new Statistic(container, this.login);
        break;
      default:
    }
  }

  render() {
    return this.container.node;
  }
}

export default Router;
