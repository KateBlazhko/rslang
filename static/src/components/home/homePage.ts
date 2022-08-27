import ButtonHref from "../common/ButtonHref";
import Control from "../common/control";
import Logging from "../Logging";

enum TextInner {
  title = 'Go on a fun journey with us!',
}

class HomePage extends Control {
  private canvas: Control<HTMLCanvasElement>
  private imgShip: HTMLImageElement | null = null
  private statWrap: Control | null = null

  constructor(parentNode: HTMLElement | null, private login: Logging) {
    super(parentNode, 'div', 'home')
    const title = new Control(this.node, 'h2', 'home__title', TextInner.title)
    this.canvas = new Control<HTMLCanvasElement>(this.node, 'canvas', 'home__canvas')
    const ctx = this.canvas.node.getContext('2d');   
    if (ctx) {
      this.draw(ctx)
      window.addEventListener('resize', this.windowResize.bind(this, ctx));
    }
    this.init()

  }

  private async init() {
    const arrHref = ['book', 'sprint', 'audio'];
    const iconList = arrHref.map(href => this.drawIcon(href))
    this.drawTeam()
    this.login.onLogin.add(this.drawStat.bind(this))
    
    const stateLogin = await this.checkLogin()
    this.drawStat(stateLogin)

  }

  private async draw(ctx: CanvasRenderingContext2D) {

    const s = 1400 / this.node.clientWidth

    ctx.canvas.width  = this.node.clientWidth + 20;
    ctx.canvas.height = this.node.clientHeight;

    this.drawWay(ctx, s)
    this.drawImg(ctx, './assets/img/ship.png', 30, 60, 150, 210)

    const widthCross = 120
    this.drawImg(ctx, './assets/img/cross.png', 1200 / s - widthCross / 2, 1350, widthCross, 110)

 
    this.drawImg(ctx, './assets/img/island.png', 150 / s, 400, 220, 200)
    this.drawImg(ctx, './assets/img/island.png', 750 / s, 750, 220, 200)

  }

  private windowResize(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.draw(ctx)

  };

  private async checkLogin() {
    const stateLog = await this.login.checkStorageLogin()

    return stateLog.state
  }
  
  private drawIcon(href: string) {
    const icon = new ButtonHref(this.node, `#${href}`, '', `home__icon home__icon_${href}`)
    const img = new Control<HTMLImageElement>(icon.node, 'img', 'home__img')
    img.node.src = `./assets/img/${href}.png`
    const text = new Control(this.node, 'div', `home__text home__text_${href}`)
    text.node.innerHTML= `
    <span>${href[0].toUpperCase()}${href.slice(1)}</span>
    `
    return icon
  }
 
  private drawStat(login: boolean) {
    if (login) {
      this.statWrap = new Control(this.node, 'div')

      const icon = new ButtonHref(this.statWrap.node, `#statistics`, '', `home__icon home__icon_stat`)
      const img = new Control<HTMLImageElement>(icon.node, 'img', 'home__img')
      img.node.src = `./assets/img/stat.png`
      const text = new Control(this.statWrap.node, 'div', `home__text home__text_stat`)
      text.node.innerHTML= `
      <span>Statistics</span>
      `
    } else {
      if (this.statWrap) this.statWrap.destroy()
    }
  }

  private drawTeam() {
      const icon = new ButtonHref(this.node, `#about`, '', `home__team`)
      const img = new Control<HTMLImageElement>(icon.node, 'img', 'home__img home__img_team')
      img.node.src = `./assets/img/team.png`
      const text = new Control(this.node, 'div', `home__text home__text_team`)
      text.node.innerHTML= `
      <span>Our team</span>
      `
      return icon
    }

  private drawWay(ctx: CanvasRenderingContext2D, s: number) {
    ctx.lineWidth = 10
    ctx.strokeStyle = '#e0677d'
    ctx.setLineDash([30, 30]);
    ctx.beginPath();
    ctx.moveTo(56, 278);
    ctx.bezierCurveTo(103.2 / s, 435.2, 1293.6 / s, 180, 1370 / s, 403.2);
    ctx.bezierCurveTo(1348.8 / s, 658.4, 350.4 / s, 651.2, 312 / s, 936.8);
    ctx.bezierCurveTo(276 / s, 1210.4, 1130.4 / s, 1199.2, 1200 / s, 1356.8);
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

    const img = new Image();   
    img.src = src

    img.onload = function() {
      if (sizeX && sizeY) {
        ctx.drawImage(img, dX, dY, sizeX, sizeY)
      } else {
        ctx.drawImage(img, dX, dY)
      }
    };
    
  }
}

export default HomePage