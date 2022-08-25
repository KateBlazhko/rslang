import Control from "../common/control";

class HomePage extends Control {
  private canvas: Control<HTMLCanvasElement>
  private imgShip: HTMLImageElement | null = null
  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'home')

    this.canvas = new Control<HTMLCanvasElement>(this.node, 'canvas', 'home__canvas')

    const ctx = this.canvas.node.getContext('2d');   
    
    if (ctx) {
      this.draw(ctx)
      

      window.addEventListener('resize', this.windowResize.bind(this, ctx));
    }


  }

  private draw(ctx: CanvasRenderingContext2D) {
    const s = 1400 / this.node.clientWidth
    ctx.canvas.width  = this.node.clientWidth;
    ctx.canvas.height = this.node.clientHeight;


    this.drawWay(ctx, s)
    this.drawImg(ctx, './assets/img/ship.png', 50, 0, 156, 215)
    this.drawImg(ctx, './assets/img/cross.svg', 1010, 1250, 160, 140)

  }

  private windowResize(ctx: CanvasRenderingContext2D) {
    this.draw(ctx)
  };
  

  private drawWay(ctx: CanvasRenderingContext2D, s: number) {
    ctx.lineWidth = 10
    ctx.strokeStyle = '#aaa9a9'
    ctx.setLineDash([30, 30]);
    ctx.beginPath();
    ctx.moveTo(56, 228);
    ctx.bezierCurveTo(103.2 / s, 385.2, 1293.6 /s, 130, 1320 / s, 353.2);
    ctx.bezierCurveTo(1348.8 / s, 608.4, 350.4 / s, 601.2, 312 / s, 886.8);
    ctx.bezierCurveTo(276 / s, 1160.4, 1130.4 / s, 1069.2, 1089.6 / s, 1306.8);
    ctx.stroke();
  }

  private drawImg(
    ctx: CanvasRenderingContext2D, 
    src: string,
    dX: number, 
    dY: number, 
    sizeX?: number,
    sizeY?: number,
  ) {

    const imgShip = new Image();   
    imgShip.src = src

    imgShip.onload = function() {
      if (sizeX && sizeY) {
        ctx.drawImage(imgShip, dX, dY, sizeX, sizeY)
      } else {
        ctx.drawImage(imgShip, dX, dY)
      }
    };
    
  }
}

export default HomePage