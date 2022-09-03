import Control from "../common/control";

class Notification extends Control {

  constructor(
    parent: HTMLElement | null,
    className: string,
    notification: string
  ) {
    super(parent, "div", className);

    const overlay = new Control(this.node, "div", "notification__overlay");
    const container = new Control(overlay.node, "div", "notification__inner");

    new Control(container.node, 'span', "notification__text", notification)

    // setTimeout(() => this.onClose(), 1500);

    overlay.node.onclick = () => {
      this.onClose();
    };
  }

  onClose() {
    this.node.remove();
  };
}

export default Notification;