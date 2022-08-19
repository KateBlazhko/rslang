import Control from './control';

class ButtonLogging<NodeType extends HTMLElement = HTMLElement> extends Control {
  stateBtn: boolean;

  constructor(
    parentNode: HTMLElement | null,
    state: boolean,
  ) {
    super(parentNode, 'button');
    this.stateBtn = state;
    this.checkStateLog(state);
  }

  checkStateLog(state: boolean) {
    if (!state) {
      this.node.className = 'button__log_in';
      this.node.textContent = 'Log In';
    } else {
      this.node.className = 'button__log_out';
      this.node.textContent = 'Log Out';
    }
  }
}

export default ButtonLogging;
