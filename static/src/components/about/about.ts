import Control from "../common/control";
import Signal from "../common/signal";
import Logging from "../Logging";

class About extends Control {
  constructor(
    private parentNode: HTMLElement | null,
    private login: Logging,
    private onGoBook: Signal<string>
  ) {
    super(parentNode, "div", "about");
  }
}

export default About;
