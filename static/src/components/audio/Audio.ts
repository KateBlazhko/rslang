import Control from '../common/control';

class Audio extends Control {
  constructor(
    parentNode: HTMLElement | null,
  ) {
    super(parentNode, 'div', 'audio__container', '');
  }
}

export default Audio;
