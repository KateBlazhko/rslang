import Header from './Header';
import Logging from '../login/Logging';
import Router from '../router/Router';
import Footer from '../footer';

class App {
  private header: Header;

  private footer: Footer;

  private main: Router;

  private login: Logging;

  constructor() {
    this.login = new Logging();
    this.header = new Header(null, this.login);
    this.main = new Router(this.login);
    this.footer = new Footer(null, 'footer');
    this.main.onGoPage.add(this.footer.hide.bind(this.footer));

    this.main.onDisable.add(this.header.setDisable.bind(this.header));
    this.login.onLogin.add(this.header.setDisableAddWords.bind(this.header));

  }

  render() {
    document.body.append(
      this.header.render(),
      this.main.render(),
      this.footer.render(),
    );

    this.footer.hide(window.location.hash.slice(1));
  }
}

export default App;
