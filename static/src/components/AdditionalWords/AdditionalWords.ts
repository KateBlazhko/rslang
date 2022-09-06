import Words from "../api/Words";
import Control from "../common/control";
import Input from "../common/Input";
import Logging from "../login/Logging";
import ErrorNewWord from "../utils/ErrorNewWord";
import { FORM_INPUTS_FILE, FORM_INPUTS_TEXT } from "./FormInputs";

enum TextInner {
  title = "Custom words",
  titleText = "Add your custom word to the app platform and other users also using its ability to master!",
  textSubmit = "Create",
  maxInputLengthWarning = "The maximum length of this field can be 150 characters",
}

class AdditionalWordsPage extends Control {
  private form: Control<HTMLElement>;

  login: Logging;

  private errorWindow: Control<HTMLButtonElement>;
  private successWindow: Control<HTMLButtonElement>;

  private submitBtn: HTMLButtonElement;

  constructor(parentNode: HTMLElement | null, login: Logging) {
    super(parentNode, "div", "additionalWords");
    this.login = login;

    const description = new Control(this.node, "div", "additionalWords__title");
    description.node.innerHTML = `<div class='additionalWords__title-preview'>
        <h3 class="additionalWords__title-text">${TextInner.title}</h3>
        <span>${TextInner.titleText}</span>
    </div>`;

    this.errorWindow = new Control<HTMLButtonElement>(
      null,
      "div",
      "error__window"
    );
    this.successWindow = new Control<HTMLButtonElement>(
      null,
      "div",
      "success__window"
    );
    this.form = new Control(this.node, "form", "additionalWords__form");

    const inputsFile = FORM_INPUTS_FILE.map(
      (fileInput) =>
        new Input(
          this.form.node,
          fileInput.type,
          fileInput.label,
          fileInput.name,
          fileInput.accept
        )
    );
    const inputsText = FORM_INPUTS_TEXT.map(
      (fileInput) =>
        new Input(
          this.form.node,
          fileInput.type,
          fileInput.label,
          fileInput.name
        )
    );

    this.form.node.addEventListener("submit", (e: SubmitEvent) => {
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
        let formData = new FormData();
        Object.entries(data).forEach(([formItemName, formItemValue]) =>
          formData.append(
            typeof formItemValue === "string" ? formItemName : "media",
            formItemValue
          )
        );
        this.createNewWord(formData);
      }
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Create";
    submitBtn.classList.add("additionalWords__submitBtn");
    this.submitBtn = submitBtn;
    this.form.node.append(submitBtn);
  }

  async createNewWord(wordFormData: FormData) {
    this.submitBtn.textContent = "Loading...";
    this.submitBtn.disabled = true;
    this.submitBtn.style.opacity = "0.5";

    this.errorWindow.destroy();
    this.successWindow.destroy();
    const stateLog = await this.login.checkStorageLogin();

    if (stateLog.state) {
      const res = await Words.createNewWord(stateLog.token, wordFormData);
      this.submitBtn.textContent = "Create";
      this.submitBtn.disabled = false;
      this.submitBtn.style.opacity = "1";

      if (res.status === 200) {
        this.successWindow.node.innerHTML = "Successfully created";
        this.form.node.append(this.successWindow.node);
        setTimeout(() => {
          this.successWindow.destroy();
        }, 5000);
      } else {
        ErrorNewWord.getErrorMessage(res.status, this.errorWindow.node);
        this.form.node.append(this.errorWindow.node);
        setTimeout(() => {
          this.errorWindow.destroy();
        }, 5000);
      }
    }
  }
}

export default AdditionalWordsPage;
