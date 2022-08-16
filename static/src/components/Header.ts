import '../style/header.scss';

class Header {
  header: HTMLElement;

  constructor() {
    this.header = document.createElement('header');
    this.createHeader();
    this.toggleActive();
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

  toggleActive() {
    const arrEl = this.header.querySelectorAll('nav a');
    arrEl.forEach((item) => {
      item.addEventListener('click', () => {
        arrEl.forEach((el) => el.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  render() {
    return this.header;
  }
}

export default Header;
