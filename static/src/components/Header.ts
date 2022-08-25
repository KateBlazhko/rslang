import '../style/header.scss';
import ButtonHref from './common/ButtonHref';
import Control from './common/control';
import Logging from './Logging';

interface IHeaderEl {
  home: ButtonHref,
  about: ButtonHref,
  book: ButtonHref,
  sprint: ButtonHref,
  audio: ButtonHref
}

const enum ButtonHrefContent {
  home = 'Home',
  about = 'About Us',
  book = 'Book',
  sprint = 'Sprint',
  audio = 'Audio'
}

class Header {
  private header: HTMLElement;

  public getAllElementsHeader: Partial<IHeaderEl>;

  arrHref: Array<ButtonHref>;

  private location: Location;

  private logging: Logging;

  constructor(login: Logging) {
    this.header = document.createElement('header');
    this.location = window.location;
    this.logging = login;
    this.getAllElementsHeader = {};
    this.arrHref = [];
    this.createHeader();
    this.addThisActive();
    this.addEventListen();
    this.forwardHistory();
  }

  createHeader() {
    const nav = new Control(this.header, 'nav', 'navbar');

    const home = new ButtonHref(nav.node, '#home', ButtonHrefContent.home);
    const about = new ButtonHref(nav.node, '#about', ButtonHrefContent.about);
    const book = new ButtonHref(nav.node, '#book/0/0', ButtonHrefContent.book);
    const sprint = new ButtonHref(nav.node, '#sprint', ButtonHrefContent.sprint);
    const audio = new ButtonHref(nav.node, '#audio', ButtonHrefContent.audio);

    this.getAllElementsHeader = {
      home, about, book, sprint, audio,
    };

    this.arrHref = [home, about, book, sprint, audio];
  }

  addEventListen() {
    this.arrHref.forEach((item) => {
      item.node.addEventListener('click', () => {
        this.arrHref.forEach((el) => el.removeActiveState());
        item.addActiveState();
      });
    });
  }

  addThisActive() {
    const activeElement = this.arrHref.find((item) => item.href === this.location.hash);
    if (activeElement) activeElement.addActiveState();
    // else this.arrHref[0].addActiveState();
  }

  forwardHistory() {
    window.addEventListener('popstate', () => {
      this.arrHref.forEach((item) => item.removeActiveState());
      this.addThisActive();
    });
  }

  render() {
    this.header.append(this.logging.node);
    return this.header;
  }
}

export default Header;
