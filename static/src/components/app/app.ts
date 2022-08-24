import Header from '../Header';
import Logging from '../Logging';
import Router from '../router/Router';

class App {
  private header: Header;

  main: Router;

  login: Logging;

  constructor() {
    this.login = new Logging();
    this.header = new Header(this.login);
    this.main = new Router();
  }

  render() {
    document.body.append(
      this.header.render(),
      this.main.render(),
    );
  }
}

export default App;
