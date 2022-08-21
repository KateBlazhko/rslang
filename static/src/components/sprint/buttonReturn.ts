import Control from '../common/control';

class ButtonReturn extends Control {
  constructor(
    private parentNode: HTMLElement | null,
    private className: string,
  ) {
    super(parentNode, 'div', className);
  }

  destroy(): void {
    this.node.remove();
  }
}

export default ButtonReturn;
