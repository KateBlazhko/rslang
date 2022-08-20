import Control from './common/control';
import '../style/modal.scss';

class ModalLog {
  private background: Control<HTMLElement>;

  private form: Control<HTMLElement>;

  private labelEmail: Control<HTMLLabelElement>;

  private inputEmail: Control<HTMLInputElement>;

  private labelPassword: Control<HTMLLabelElement>;

  private inputPassword: Control<HTMLInputElement>;

  private login: Control<HTMLElement>;

  private registration: Control<HTMLButtonElement>;

  private submit: Control<HTMLButtonElement>;

  private labelName: Control<HTMLLabelElement>;

  private inputName: Control<HTMLInputElement>;

  private state: 'login' | 'registration';

  private errorWindow: Control<HTMLButtonElement>;

  constructor() {
    this.background = new Control(null, 'div', 'background__container');
    this.state = 'login';
    this.form = new Control<HTMLFormElement>(this.background.node, 'form', 'form__container');
    this.login = new Control<HTMLButtonElement>(this.form.node, 'button', 'active', 'Login');
    this.registration = new Control<HTMLButtonElement>(this.form.node, 'button', '', 'Registration');
    this.labelName = new Control<HTMLLabelElement>(this.form.node, 'label', '', 'Your Name: ');
    this.inputName = new Control<HTMLInputElement>(this.labelName.node, 'input', '');
    this.labelEmail = new Control<HTMLLabelElement>(this.form.node, 'label', '', 'Email: ');
    this.inputEmail = new Control<HTMLInputElement>(this.labelEmail.node, 'input', '');
    this.labelPassword = new Control<HTMLLabelElement>(this.form.node, 'label', '', 'Password: ');
    this.inputPassword = new Control<HTMLInputElement>(this.labelPassword.node, 'input', '');
    this.submit = new Control<HTMLButtonElement>(this.form.node, 'button', 'button__submit', 'Login');
    this.errorWindow = new Control<HTMLButtonElement>(null, 'div', 'error__window');
    this.remoteLogReg();
    this.closeModal();
    this.addTypesOfElement();
  }

  addTypesOfElement() {
    this.inputEmail.node.type = 'email';
    this.inputPassword.node.type = 'password';
  }

  closeModal() {
    this.background.node.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.className.includes('background__container')) {
        this.clearInput();
        this.background.destroy();
      }
    });
  }

  clearInput() {
    this.inputName.node.value = '';
    this.inputEmail.node.value = '';
    this.inputPassword.node.value = '';
  }

  checkValidatePassword() {
    let state = false;
    const password = this.inputPassword.node.value;
    const pattern = /[0-9a-zA-Z!@#$%^&*]{8,}/;
    if (!pattern.test(password)) {
      this.inputPassword.node.className = 'no_valid';
    } else {
      this.inputPassword.node.classList.remove('no_valid');
      state = true;
    }
    return state;
  }

  checkValidateEmail() {
    let state = false;
    const email = this.inputEmail.node.value;
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pattern.test(email)) {
      this.inputEmail.node.className = 'no_valid';
    } else {
      this.inputEmail.node.classList.remove('no_valid');
      state = true;
    }
    return state;
  }

  checkValidateName() {
    const name = this.inputName.node.value;
    if (!(name.length > 0)) this.inputName.node.className = 'no_valid';
    else this.inputEmail.node.classList.remove('no_valid');
    return name.length > 0;
  }

  callErrorWindow(statusCode: number) {
    if (statusCode === 404) {
      this.errorWindow.node.innerHTML = 'пользователя с данным Email не существует';
    }
    if (statusCode === 403) {
      this.errorWindow.node.innerHTML = 'вы указали неверный пароль';
    }
    if (statusCode === 417) {
      this.errorWindow.node.innerHTML = 'пользователя с таким Email уже существует';
    }
    this.form.node.append(this.errorWindow.node);
  }

  remoteLogReg() {
    this.labelName.node.style.display = 'none';
    this.login.node.addEventListener('click', () => {
      this.login.node.classList.add('active');
      this.registration.node.classList.remove('active');
      this.submit.node.textContent = 'LOGIN';
      this.labelName.node.style.display = 'none';
      this.state = 'login';
    });

    this.registration.node.addEventListener('click', () => {
      this.registration.node.classList.add('active');
      this.login.node.classList.remove('active');
      this.submit.node.textContent = 'REGISTRATION';
      this.labelName.node.style.display = 'flex';
      this.state = 'registration';
    });
  }

  get formElements() {
    return {
      background: this.background,
      name: this.inputName,
      form: this.form,
      email: this.inputEmail,
      password: this.inputPassword,
      submit: this.submit,
      state: this.state,
      errorWindow: this.errorWindow,
    };
  }

  callModal() {
    document.body.prepend(this.background.node);
  }
}

export default ModalLog;
