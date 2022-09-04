import Control from "../common/control";
import Input from "../common/Input";
import Logging from "../login/Logging";
import { FORM_INPUTS_FILE, FORM_INPUTS_TEXT } from "./formInputs";

enum TextInner {
  title = "Additional Words",
  titleText = "Add your custom word to the app platform and other users also using its ability to master!",
  textSubmit = "Create",
  maxInputLengthWarning = "The maximum length of this field can be 150 characters",
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

    const inputsFile = FORM_INPUTS_FILE.map(
      (fileInput) =>
        new Input(
          form.node,
          fileInput.type,
          fileInput.label,
          fileInput.name,
          fileInput.accept
        )
    );
    const inputsText = FORM_INPUTS_TEXT.map(
      (fileInput) =>
        new Input(form.node, fileInput.type, fileInput.label, fileInput.name)
    );

    form.node.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      [...inputsText, ...inputsFile].forEach((item) => {
        item.node.querySelector(".warning__div")?.remove();
        item.input.classList.remove("no_valid");
      });

      const data = Object.fromEntries(
        new FormData(e.target as HTMLFormElement).entries()
      );

      let isValidForm = true;

      Object.entries(data).forEach((dataItem) => {
        const [dataName, dataValue] = dataItem;
        if (typeof dataValue === "string" && dataValue.length > 150) {
          isValidForm = false;
          const input = document.querySelector(`[name=${dataName}]`);
          input?.classList.add("no_valid");
          input?.insertAdjacentHTML(
            "afterend",
            `<div class="warning__div">${TextInner.maxInputLengthWarning}</div>`
          );
        }
      });

      if (isValidForm) {
      }
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Create";
    submitBtn.classList.add("additionalWords__submitBtn");
    form.node.append(submitBtn);
  }
}

export default AdditionalWordsPage;
