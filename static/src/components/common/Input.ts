import Control from "./control";

class Input<NodeType extends HTMLElement = HTMLElement> extends Control {
  private _input: HTMLInputElement;

  constructor(
    parentNode: HTMLElement | null,
    type = "text",
    content = "",
    name = "",
    accept = ""
  ) {
    super(parentNode, "label", "");
    this._input = document.createElement("input");
    this.createInput(type, content, name, accept);
  }

  createInput(type: string, content: string, name: string, accept: string) {
    this._input.type = type;
    this._input.max = "150";
    this._input.min = "0";
    this._input.required = true;
    if (name) {
      this._input.name = name;
    }
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
