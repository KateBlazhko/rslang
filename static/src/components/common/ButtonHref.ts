import Control from './control';

class ButtonHref extends Control<HTMLAnchorElement> {
  public href: string;

  constructor(
    parentNode: HTMLElement | null,
    href: string,
    content?: string,
    className = '',
  ) {
    super(parentNode, 'a', className, content);
    this.href = href;
    this.addHref(href);
  }

  addHref(href: string) {
    const el = this.node as HTMLAnchorElement;
    el.href = href;
  }

  addActiveState() {
    this.node.classList.add('active');
  }

  removeActiveState() {
    this.node.classList.remove('active');
  }
}

export default ButtonHref;
