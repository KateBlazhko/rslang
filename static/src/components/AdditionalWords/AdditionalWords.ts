import Control from "../common/control";
import Input from "../common/Input";
import Logging from "../login/Logging";

enum TextInner {
  title = "Additional Words",
  titleText = "Add your custom word to the app platform and other users also using its ability to master!",
}

class AdditionalWordsPage extends Control {
  constructor(public parentNode: HTMLElement | null, public login: Logging) {
    super(parentNode, "div", "additionalWords");

    const description = new Control(this.node, "div", "additionalWords__title");
    description.node.innerHTML = `<div class='additionalWords__title-preview'>
        <h3 class="additionalWords__title-text">${TextInner.title}</h3>
        <span>${TextInner.titleText}</span>
    </div>`;
    const form = new Control(this.node, "form", "additionalWords__form");
    new Input(form.node, "file", "Word audio:", ".mp3");
    new Input(form.node, "file", "Word audio meaning:", ".mp3");
    new Input(form.node, "file", "Word audio example:", ".mp3");
    new Input(form.node, "file", "Word image:", "image/*");
    // audio.node.accept = ".mp3";
    // const audio = new Control(
    //   form.node,
    //   "input",
    //   "additionalWords__input-file"
    // );
    // audio.node.type = "file";
    // form.node.innerHTML = `<input type="file" accept=".mp3"/>
    // <input type="file" accept=".mp3"/>
    // <input type="file" accept=".mp3"/>`;
  }
}

export default AdditionalWordsPage;
