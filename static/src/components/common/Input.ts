import Control from "./control";

class Input<NodeType extends HTMLElement = HTMLElement> extends Control {
  private _input: HTMLInputElement;

  constructor(
    parentNode: HTMLElement | null,
    type = "text",
    content = "",
    accept = ""
  ) {
    super(parentNode, "label", "");
    this._input = document.createElement("input");
    this.createInput(type, content, accept);
  }

  createInput(type: string, content: string, accept: string) {
    this._input.type = type;
    if (accept) {
      this._input.accept = accept;
    }
    this.node.textContent = content;
    this.node.append(this._input);
  }

  get input() {
    return this._input;
  }

  get label() {
    return this.node;
  }
}

export default Input;
