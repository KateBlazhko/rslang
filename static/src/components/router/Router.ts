import Sprint from '../sprint/sprint';
import Signal from '../common/signal';
import Control from '../common/control';
import Logging from '../Logging';
import Audio from '../audio/Audio';
import Book from '../book/Book';

class Router {
  private location: Location;

  private currentPage: Control | Sprint | null = null;

  private container: Control;

  prevPage: { page: string; };

  constructor(private login: Logging) {
    this.container = new Control(document.body, 'main', 'page');
    this.prevPage = { page: '' };
    this.location = window.location;
    this.setPage(this.location.hash.slice(1));
    this.hashChange();
  }

  public onGoPage = new Signal<string>();

  private hashChange() {
    window.addEventListener('hashchange', () => {
      if (this.currentPage) this.currentPage.destroy();
      this.setPage(this.location.hash.slice(1));
      this.prevPage.page = window.location.hash;
    });
  }

  private setPage(hash: string) {
    const container = this.container.node;

    if (hash.includes('book')) {
      this.onGoPage.emit(hash);
      this.currentPage = new Book(container, this.login, hash);
    }

    if (window.location.hash.length === 0) {
      window.location.hash = '#home';
    }

    switch (hash) {
      case 'home':
        this.onGoPage.emit(hash);
        container.innerHTML = '<h1>Home</h1>';
        break;
      case 'about':
        container.innerHTML = '<h1>About Us</h1>';
        break;
      case 'sprint':
        this.onGoPage.emit(hash);
        this.currentPage = new Sprint(container, this.login, this.onGoPage);
        break;
      case 'audio':
        this.onGoPage.emit(hash);
        this.currentPage = new Audio(container, this.login, this.prevPage);
        break;
      case 'statistics':
        container.innerHTML = '<h1>statistics</h1>';
        break;
      default:
        // container.innerHTML = '<h1>Home</h1>';
    }
  }

  render() {
    return this.container.node;
  }
}

export default Router;
