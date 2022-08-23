import Control from './common/control';
import '../style/modal.scss';
import Input from './common/Input';
import Validator from './common/Validator';

class ModalLog {
  private background: Control<HTMLElement>;

  private form: Control<HTMLElement>;

  private login: Control<HTMLElement>;

  private registration: Control<HTMLButtonElement>;

  private submit: Control<HTMLButtonElement>;

  private action: 'login' | 'registration';

  private errorWindow: Control<HTMLButtonElement>;

  private outModal: Control<HTMLElement>;

  public noBtn: Control<HTMLButtonElement>;

  public yesBtn: Control<HTMLButtonElement>;

  email: Input<HTMLElement>;

  password: Input<HTMLElement>;

  name: Input<HTMLElement>;

  constructor() {
    this.background = new Control(null, 'div', 'background__container');
    this.action = 'login';
    this.form = new Control<HTMLFormElement>(null, 'form', 'form__container');
    this.login = new Control<HTMLButtonElement>(this.form.node, 'button', 'active', 'Login');
    this.registration = new Control<HTMLButtonElement>(this.form.node, 'button', '', 'Registration');
    this.name = new Input(this.form.node, 'text', 'Your Name: ');
    this.email = new Input(this.form.node, 'email', 'Email: ');
    this.password = new Input(this.form.node, 'password', 'Password: ');
    this.submit = new Control<HTMLButtonElement>(this.form.node, 'button', 'button__submit', 'Login');
    this.errorWindow = new Control<HTMLButtonElement>(null, 'div', 'error__window');
    this.outModal = new Control(null, 'div', 'out__modal', 'Вы точно хотите выйти их аккаунта ?');
    this.noBtn = new Control<HTMLButtonElement>(this.outModal.node, 'button', 'button__out_no', 'NO');
    this.yesBtn = new Control<HTMLButtonElement>(this.outModal.node, 'button', 'button__out_yes', 'YES');
    this.remoteLogReg();
    this.closeModal();
    this.checkAllInputsValidate();
  }

  closeModal() {
    this.background.node.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.className.includes('background__container')) {
        Validator.removeAllWarning(this.name, this.email, this.password);
        this.background.destroy();
        this.errorWindow.destroy();
      }
    });
  }

  checkAllInputsValidate() {
    Validator.addListen('name', this.name);
    Validator.addListen('email', this.email);
    Validator.addListen('password', this.password);
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
    this.name.label.style.display = 'none';
    this.login.node.addEventListener('click', () => {
      this.login.node.classList.add('active');
      this.registration.node.classList.remove('active');
      this.submit.node.textContent = 'Login';
      this.name.label.style.display = 'none';
      this.action = 'login';
    });

    this.registration.node.addEventListener('click', () => {
      this.registration.node.classList.add('active');
      this.login.node.classList.remove('active');
      this.submit.node.textContent = 'Registration';
      this.name.label.style.display = 'flex';
      this.action = 'registration';
    });
  }

  get formElements() {
    return {
      background: this.background,
      name: this.name.input,
      form: this.form,
      email: this.email.input,
      password: this.password.input,
      submit: this.submit,
      state: this.action,
      errorWindow: this.errorWindow,
    };
  }

  callModal(state: boolean) {
    this.background.node.innerHTML = '';
    if (!state) this.background.node.append(this.form.node);
    else this.background.node.append(this.outModal.node);
    document.body.prepend(this.background.node);
  }
}

export default ModalLog;
