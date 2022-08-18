import '../style/header.scss';
import ButtonHref from './common/ButtonHref';
import Control from './common/control';
import Signal from './common/signal';

interface IHeaderEl {
  home: ButtonHref,
  about: ButtonHref,
  book: ButtonHref,
  sprint: ButtonHref,
  audio: ButtonHref
}
class Header {
  private header: HTMLElement;

  public obgHeader: Partial<IHeaderEl>;

  arrHref: Array<ButtonHref>;

  private location: Location;

  constructor() {
    this.header = document.createElement('header');
    this.location = window.location;
    this.obgHeader = {};
    this.arrHref = [];
    this.createHeader();
    this.addThisActive();
    this.addEventListen();
  }

  createHeader() {
    const nav = new Control(this.header, 'nav', 'navbar', '');
    const home = new ButtonHref<HTMLAnchorElement>(nav.node, '#home', 'Home');
    const about = new ButtonHref<HTMLAnchorElement>(nav.node, '#about', 'About Us');
    const book = new ButtonHref<HTMLAnchorElement>(nav.node, '#book', 'Book');
    const sprint = new ButtonHref<HTMLAnchorElement>(nav.node, '#sprint', 'Sprint');
    const audio = new ButtonHref<HTMLAnchorElement>(nav.node, '#audio', 'Audio');

    this.obgHeader = {
      home, about, book, sprint, audio,
    };

    this.arrHref = [home, about, book, sprint, audio];
  }

  addEventListen() {
    this.arrHref.forEach((item) => {
      item.node.addEventListener('click', () => {
        this.arrHref.forEach((el) => el.noActive());
        item.active();
      });
    });
  }

  addThisActive() {
    const activeElement = this.arrHref.find((item) => item.href === this.location.hash);
    if (activeElement) activeElement.active();
  }

  render() {
    return this.header;
  }
}

export default Header;
