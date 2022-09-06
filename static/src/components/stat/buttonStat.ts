import Control from '../common/control';

class ButtonStat extends Control {
  constructor(
    private parentNode: HTMLElement | null,
    private className: string,
    private content: string,
    public name: string,
  ) {
    super(parentNode, 'div', className, content);

    this.name = name;
  }

  destroy(): void {
    this.node.remove();
  }
}

export default ButtonStat;
