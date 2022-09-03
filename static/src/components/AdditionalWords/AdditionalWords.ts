import Control from "../common/control";
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
  }
}

export default AdditionalWordsPage;
