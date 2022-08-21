import Control from '../common/control';

class Timer extends Control {
  private timer: number = 0;

  public onTimeOut: () => void;

  public onTimeFinishing: () => boolean;

  private isFinishing: boolean = false;

  constructor(parentNode:HTMLElement, className: string) {
    super(parentNode, 'span', className);
    this.onTimeOut = () => {};
    this.onTimeFinishing = () => true;
  }

  start(time:number) {
    this.render(time);
    let currentTime = time;

    this.timer = window.setInterval(() => {
      currentTime -= 1;
      this.render(currentTime);

      if (currentTime <= 10) {
        if (!this.isFinishing) this.isFinishing = this.onTimeFinishing();
      }

      if (currentTime <= 0) {
        this.onTimeOut();
      }
    }, 1000);
  }

  render(currentTime:number) {
    this.node.textContent = `${currentTime}`;
  }

  stop() {
    window.clearInterval(this.timer);
  }
}

export default Timer;
