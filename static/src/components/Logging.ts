import ButtonHref from './common/ButtonHref';
import ButtonLogging from './common/ButtonLogging';
import Control from './common/control';
import '../style/logging.scss';
import ModalLog from './ModalLog';
import { createUser, ILoginUser, loginUser } from './api/dbLoging';

class Logging {
  container: Control<HTMLElement>;

  loginBtn: ButtonLogging;

  profile: ButtonHref;

  stateLog: { state: boolean; };

  modal: ModalLog;

  constructor() {
    this.container = new Control<HTMLDivElement>(null, 'div', 'logging__container');
    this.stateLog = { state: false };
    this.checkStorageLogin();
    this.loginBtn = new ButtonLogging<HTMLButtonElement>(this.container.node, this.stateLog.state);
    this.profile = new ButtonHref(this.container.node, '#statistics', '', 'profile');
    this.accessStatistics();
    this.modal = new ModalLog();
    this.addCallModal();
    this.outModalBtnListen();
    this.listenSubmit();
  }

  listenSubmit() {
    this.modal.formElements.form.node.addEventListener('click', (e) => {
      e.preventDefault();
      this.modal.formElements.errorWindow.destroy();
    });

    this.modal.formElements.submit.node.addEventListener('click', () => {
      if (!this.stateLog.state) {
        const name = this.modal.checkValidateName();
        const email = this.modal.checkValidateEmail();
        const password = this.modal.checkValidatePassword();

        if (this.modal.formElements.state === 'registration') this.registrationMethod(email, password, name);
        else this.loggingMethod(email, password);
      }
    });
  }

  async loggingMethod(email: boolean, password: boolean) {
    if (email && password) {
      const res = await loginUser({
        email: this.modal.formElements.email.node.value,
        password: this.modal.formElements.password.node.value,
      });
      if (res.status === 200) {
        console.log(await res.json());
        this.setLocalStorageLogin();
        this.successLog();
      } else {
        this.modal.callErrorWindow(res.status);
      }
    }
  }

  async registrationMethod(email: boolean, password: boolean, name: boolean) {
    if (email && password && name) {
      const res = await createUser({
        name: this.modal.formElements.name.node.value,
        email: this.modal.formElements.email.node.value,
        password: this.modal.formElements.password.node.value,
      });

      if (res.status === 200) {
        this.setLocalStorageLogin();
        this.successLog();
      } else {
        this.modal.callErrorWindow(res.status);
      }
    }
  }

  successLog() {
    this.modal.clearInput();
    this.modal.formElements.background.destroy();
    this.stateLog.state = true;
    this.loginBtn.checkStateLog(this.stateLog.state);
    this.accessStatistics();
  }

  setLocalStorageLogin() {
    localStorage.setItem('user', JSON.stringify({
      email: this.modal.formElements.email.node.value,
      password: this.modal.formElements.password.node.value,
    }));
  }

  async checkStorageLogin() {
    const response = localStorage.getItem('user');
    if (response) {
      const user = JSON.parse(response) as ILoginUser;
      await loginUser({ email: user.email, password: user.password });
      this.successLog();
    }
  }

  accessStatistics() {
    this.profile.node.addEventListener('click', (event) => {
      if (!this.stateLog.state) event.preventDefault();
    });
    if (!this.stateLog.state) {
      this.profile.node.textContent = 'U';
      window.location.hash = '#home';
    } else this.profile.node.textContent = 'A';
  }

  outModalBtnListen() {
    this.modal.yesBtn.node.addEventListener('click', () => {
      this.stateLog.state = false;
      this.loginBtn.checkStateLog(this.stateLog.state);
      this.accessStatistics();
      localStorage.removeItem('user');
      this.modal.formElements.background.destroy();
    });
    this.modal.noBtn.node.addEventListener('click', () => this.modal.formElements.background.destroy());
  }

  addCallModal() {
    this.loginBtn.node.addEventListener('click', () => {
      this.modal.callModal(this.stateLog.state);
    });
  }

  get node() {
    return this.container.node;
  }
}

export default Logging;
