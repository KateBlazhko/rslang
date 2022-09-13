import Burger from '../common/BurgerEl.';
import ButtonHref from '../common/ButtonHref';
import Control from '../common/control';
import Logging from '../login/Logging';

interface IHeaderEl {
  home: ButtonHref,
  about: ButtonHref,
  book: ButtonHref,
  sprint: ButtonHref,
  audio: ButtonHref,
  additionalWords: ButtonHref
}

const enum ButtonHrefContent {
  home = 'Home',
  about = 'About Us',
  book = 'Book',
  sprint = 'Sprint',
  audio = 'Audio',
  additionalWords = 'Add Words',
  title = 'RS Lang'
}

class Header extends Control {
  public getAllElementsHeader: Partial<IHeaderEl>;

  arrHref: Array<ButtonHref>;

  private location: Location;

  private logging: Logging;

  private nav: Control;

  private burger: Control;

  constructor(
    private parent: HTMLElement | null,
    login: Logging,
  ) {
    super(parent, 'header', 'header');
    this.location = window.location;
    this.logging = login;
    this.getAllElementsHeader = {};
    this.arrHref = [];
    const title = new ButtonHref(this.node, '#home', ButtonHrefContent.title, 'header__title');
    this.nav = new Control(this.node, 'nav', 'navbar');
    this.createHeader();
    this.burger = new Burger(this.node);
    this.addThisActive();
    this.addEventListen();
    this.forwardHistory();
  }

  async createHeader() {
   
    const home = new ButtonHref(this.nav.node, '#home', ButtonHrefContent.home);
    const about = new ButtonHref(this.nav.node, '#about', ButtonHrefContent.about);
    const book = new ButtonHref(this.nav.node, '#book', ButtonHrefContent.book);
    const sprint = new ButtonHref(this.nav.node, '#sprint', ButtonHrefContent.sprint);
    const audio = new ButtonHref(this.nav.node, '#audio', ButtonHrefContent.audio);
    const additionalWords = new ButtonHref(this.nav.node, '#additionalWords', ButtonHrefContent.additionalWords); 

    const stateLog = await this.logging.checkStorageLogin()
    if (stateLog.state) {
      additionalWords.node.classList.remove('disable')
    } else {
      additionalWords.node.classList.add('disable')
    }

    this.getAllElementsHeader = {
      home, about, book, sprint, audio, additionalWords
    };

    this.arrHref = [home, about, book, sprint, audio, additionalWords];
  }

  setDisable(isDisable: boolean) {
    const [, , , ...gameButtons] = this.arrHref;

    if (isDisable) {
      gameButtons.forEach((button) => {
        button.node.classList.add('disable');
      });
    } else {
      gameButtons.forEach((button) => {
        button.node.classList.remove('disable');
      });
    }
  }

  setDisableAddWords(isDisable: boolean) {
    const [, , , , , additionalWords] = this.arrHref;
    if (isDisable) {
      additionalWords.node.classList.remove('disable');
    } else {
      additionalWords.node.classList.add('disable');
    }
  
  }

  addEventListen() {
    this.arrHref.forEach((item) => {
      item.node.addEventListener('click', () => {
        this.arrHref.forEach((el) => el.removeActiveState());
        item.addActiveState();
        this.nav.node.classList.toggle('active');
        this.burger.node.classList.toggle('active');
      });
    });
    document.addEventListener('click', (event) => {
      const t = event.target as HTMLElement;
      if (t.className.includes && !t.className.includes('navbar') && !t.className.includes('burger')) {
        this.nav.node.classList.remove('active');
        this.burger.node.classList.remove('active');
      }
    });
    this.burger.node.addEventListener('click', () => {
      this.nav.node.classList.toggle('active');
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
    this.node.append(this.logging.node);
    return this.node;
  }
}

export default Header;
