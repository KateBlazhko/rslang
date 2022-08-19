import Control from './common/control';
import '../style/modal.scss';

class ModalLog {
  background: Control<HTMLElement>;

  form: Control<HTMLElement>;

  labelEmail: Control<HTMLLabelElement>;

  inputEmail: Control<HTMLInputElement>;

  labelPassword: Control<HTMLLabelElement>;

  inputPassword: Control<HTMLInputElement>;

  login: Control<HTMLElement>;

  registration: Control<HTMLButtonElement>;

  constructor() {
    this.background = new Control(null, 'div', 'background__container');
    this.form = new Control<HTMLFormElement>(this.background.node, 'form', 'form__container');
    this.login = new Control<HTMLButtonElement>(this.form.node, 'button', '', 'Login');
    this.registration = new Control<HTMLButtonElement>(this.form.node, 'button', '', 'Registration');
    this.labelEmail = new Control<HTMLLabelElement>(this.form.node, 'label', '', 'Email: ');
    this.inputEmail = new Control<HTMLInputElement>(this.labelEmail.node, 'input', '');
    this.labelPassword = new Control<HTMLLabelElement>(this.form.node, 'label', '', 'Password: ');
    this.inputPassword = new Control<HTMLInputElement>(this.labelPassword.node, 'input', '');
    this.closeModal();
  }

  closeModal() {
    this.background.node.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.className.includes('background__container')) this.background.destroy();
    });
  }

  callModal() {
    document.body.prepend(this.background.node);
  }
}

export default ModalLog;
