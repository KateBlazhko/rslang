import Header from '../Header';
import Logging from '../Logging';
import Router from '../router/Router';
import Footer from '../footer'
class App {
  private header: Header;
  private footer: Footer
  private main: Router;

  private login: Logging;

  constructor() {
    this.login = new Logging();
    this.header = new Header(null, 'header', this.login);
    this.main = new Router(this.login);
    this.footer = new Footer(null, 'footer');
    this.main.onGoPage.add(this.footer.hide.bind(this.footer))

  }

  render() {
    document.body.append(
      this.header.render(),
      this.main.render(),
      this.footer.render(),
    );
  }

}

export default App;
