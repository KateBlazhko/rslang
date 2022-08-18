import Control from './control';

class ButtonHref <NodeType extends HTMLElement = HTMLElement> extends Control {
  public href: string;

  constructor(
    parentNode: HTMLElement | null,
    href = '',
    content = '',
    className = '',
    tagName = 'a',
  ) {
    super(parentNode, tagName, className, content);
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
