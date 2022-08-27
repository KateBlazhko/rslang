import Sprint from '../sprint/sprint';
import Signal from '../common/signal';
import Control from '../common/control';
import Logging from '../Logging';

class Router {
  private location: Location;

  private currentPage: Control | Sprint | null = null;

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

    switch (hash) {
      case 'home':
        this.onGoPage.emit(hash);
        container.innerHTML = '<h1>Home</h1>';
        break;
      case 'about':
        container.innerHTML = '<h1>About Us</h1>';
        break;
      case 'book':
        this.onGoPage.emit(hash);
        container.innerHTML = '<h1>Book</h1>';
        break;
      case 'sprint':
        container.innerHTML = '';
        this.currentPage = new Sprint(container, this.login, this.onGoPage);
        break;
      case 'audio':
        container.innerHTML = '<h1>Audio</h1>';
        break;
      case 'statistics':
        container.innerHTML = '<h1>statistics</h1>';
        break;
      default:
        container.innerHTML = '<h1>Home</h1>';
    }
  }

  render() {
    return this.container.node;
  }
}

export default Router;
