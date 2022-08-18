import Control from './control';

class ButtonHref extends Control<HTMLAnchorElement> {
  public href: string;

  constructor(
    parentNode: HTMLElement | null,
    href: string,
    content?: string,
  ) {
    super(parentNode, 'a', '', content);
    this.href = href;
    this.addHref(href);
  }

  addHref(href: string) {
    const el = this.node as HTMLAnchorElement;
    el.href = href;
  }

  active() {
    this.node.classList.add('active');
  }

  noActive() {
    this.node.classList.remove('active');
  }
}

export default ButtonHref;
