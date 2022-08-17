import Header from '../Header';
import Router from '../router/Router';

class App {
  private header: Header;

  main: Router;

  constructor() {
    this.header = new Header();
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
