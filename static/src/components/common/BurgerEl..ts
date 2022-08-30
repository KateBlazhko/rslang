import Control from './control';

class Burger extends Control {
  spanOne: Control<HTMLElement>;

  spanTwo: Control<HTMLElement>;

  spanTree: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement | null,
  ) {
    super(parentNode, 'div', 'header__burger_menu');
    this.spanOne = new Control(this.node, 'span', 'burger');
    this.spanTwo = new Control(this.node, 'span', 'burger');
    this.spanTree = new Control(this.node, 'span', 'burger');
    this.addActive();
  }

  addActive() {
    this.node.addEventListener('click', () => {
      this.node.classList.toggle('active');
    });
  }
}

export default Burger;
