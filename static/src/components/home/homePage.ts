import Control from "../common/control";

class HomePage extends Control {
  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'home')

    const canvas = new Control<HTMLCanvasElement>(this.node, 'canvas', 'home__canvas')

    const ctx = canvas.node.getContext('2d');   
    if (ctx) {
      this.drawWay(ctx)
    }
    
  }

  private drawWay(ctx: CanvasRenderingContext2D) {
    ctx.canvas.width  = this.node.clientWidth;
    ctx.canvas.height = this.node.clientHeight;
    const xoff = 0;
    const yoff = 0

    ctx.lineWidth = 10
    ctx.strokeStyle = '#aaa9a9'
    ctx.setLineDash([30, 30]);
    ctx.beginPath();
    ctx.moveTo(68 + xoff, 105 + yoff);
    ctx.moveTo(56 + xoff, 28 + yoff);
    ctx.bezierCurveTo(103.2 + xoff, 235.2 + yoff, 1293.6 + xoff, 0 + yoff, 1320 + xoff, 223.2 + yoff);
    ctx.bezierCurveTo(1348.8 + xoff, 458.4 + yoff, 350.4 + xoff, 451.2 + yoff, 312 + xoff, 736.8 + yoff);
    ctx.bezierCurveTo(276 + xoff, 1010.4 + yoff, 1130.4 + xoff, 919.2 + yoff, 1089.6 + xoff, 1156.8 + yoff);
    ctx.stroke();
  }
}

export default HomePage