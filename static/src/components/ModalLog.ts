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

  // checkValidatePassword() {
  //   const password = this.inputPassword.node.value;
  //   if (password.length >= 8, password) {}
  // }

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
    };
  }

  callModal() {
    document.body.prepend(this.background.node);
  }
}

export default ModalLog;
