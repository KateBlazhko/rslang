class SVG {
  svg: SVGSVGElement
  constructor(
    private parent: HTMLElement | null,
    private className: string,
    private link: string
  ) {
    
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add(className);

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link)
    this.svg.append(use);

    if (parent) {
      parent.append(this.svg);
    }
  }

  setColor(color: string) {
    this.svg.style.fill = color
  }
}

export default SVG
