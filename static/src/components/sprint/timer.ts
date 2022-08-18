import Control from "../common/control";
import Signal from "../common/signal";

class Timer extends Control{
  private timer: number = 0;
  private initialTime: number = 0
  public onTimeOut = () => {}

  constructor(parentNode:HTMLElement, className: string){
    super(parentNode, 'div', className);
  }

  start(time:number) {
    this.initialTime = time;

    // if (this.timer) {
    //   this.stop();
    // }

    this.render(time);
    let currentTime = time;

    this.timer = window.setInterval(()=>{

      currentTime--;
      this.render(currentTime);

      if (currentTime <= 0){
        this.onTimeOut()
      }

    }, 1000);
  }

  render(currentTime:number) {
    this.node.textContent = `${this.initialTime} / ${currentTime}`;
  }

  stop(){
    window.clearInterval(this.timer);
  }
}

export default Timer
