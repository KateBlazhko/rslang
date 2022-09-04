import Control from '../common/control';
import '../../style/loader.scss';

class Loader extends Control {
  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'loader');
    this.createLoader();
  }

  createLoader() {
    this.node.innerHTML = `
      <div class="spinner">
        <div></div>
        <div></div>
      </div>
    `;
  }
}

export default Loader;
