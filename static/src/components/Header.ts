import '../style/header.scss';

class Header {
  header: HTMLElement;

  constructor() {
    this.header = document.createElement('header');
    this.createHeader();
  }

  createHeader() {
    this.header.innerHTML = `
    <nav>
      <a href='#home'>Home</a>
      <a href='#about'>About Us</a>
      <a href='#book'>Book</a>
      <a href='#audio'>Audio</a>
      <a href='#sprint'>Sprint</a>
    </nav>
    <div class='user'>
      <button class='log-in' id='login'>Log in</button>
      <a href='#statistics' class='profile'>U</a>
    </div>
    `;
  }

  render() {
    return this.header;
  }
}

export default Header;
