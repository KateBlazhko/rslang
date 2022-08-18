import Control from "../common/control";

class ButtonAnswer extends Control {

  constructor(
    private parentNode: HTMLElement | null,
    private className: string,
    private content: string,
    public value: boolean
  ) {
    super(parentNode, 'div', className, content)

    this.value = value
  }

  destroy(): void {
    this.node.remove();
  }
}

export default ButtonAnswer;