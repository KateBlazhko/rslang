import Control from '../components/common/control';

class Footer extends Control {
  constructor(parent: HTMLElement | null, className: string) {
    super(parent, 'footer', className);

    this.node.innerHTML = Footer.drawFooter();
  }

  private static drawFooter() {
    return `
    <a class="link" href="https://github.com/Alex99like">Aleksander</a>
    <a class="link" href="https://github.com/goldyukol">Yury Kalenkou</a>
    <a class="link" href="https://github.com/KateBlazhko">Kate Blazhko</a>
    <span>2022</span>
    <p class="text">
      Training project
    </p>
    <div class="footer__rs">
      <a class="link rs" href="https://rs.school/js/">«JavaScript/Frontend»</a>
      <div class="rs__logo"></div>
    </div>
    `;
  }

  render() {
    return this.node;
  }
}

export default Footer;
