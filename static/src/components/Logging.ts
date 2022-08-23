import ButtonHref from './common/ButtonHref';
import ButtonLogging from './common/ButtonLogging';
import Control from './common/control';
import '../style/logging.scss';
import ModalLog from './ModalLog';
import {
  createUser, getUser, IAuth, loginUser,
} from './api/dbLoging';
import Validator from './common/Validator';

class Logging {
  private container: Control<HTMLElement>;

  private loginBtn: ButtonLogging;

  private profile: ButtonHref;

  private stateLog: { state: boolean; };

  private modal: ModalLog;

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
        const email = Validator.validate('email', this.modal.email);
        const password = Validator.validate('password', this.modal.password);

        if (this.modal.formElements.state === 'registration') {
          const name = Validator.validate('name', this.modal.name);
          this.registerUser(email, password, name);
        } else {
          this.logUser(email, password);
        }
      }
    });
  }

  async logUser(email: boolean, password: boolean) {
    if (email && password) {
      const res = await loginUser({
        email: this.modal.formElements.email.value,
        password: this.modal.formElements.password.value,
      });
      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(await res.json()));
        this.successLog();
      } else {
        this.modal.callErrorWindow(res.status);
      }
    }
  }

  async registerUser(email: boolean, password: boolean, name: boolean) {
    if (email && password && name) {
      const res = await createUser({
        name: this.modal.formElements.name.value,
        email: this.modal.formElements.email.value,
        password: this.modal.formElements.password.value,
      });

      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(await res.json()));
        this.successLog();
      } else {
        this.modal.callErrorWindow(res.status);
      }
    }
  }

  successLog() {
    Validator.removeAllWarning(this.modal.name, this.modal.email, this.modal.password);
    this.modal.formElements.background.destroy();
    this.stateLog.state = true;
    this.loginBtn.updateLogStatus(this.stateLog.state);
    this.accessStatistics();
  }

  async checkStorageLogin() {
    const response = localStorage.getItem('user');
    if (response) {
      const user = JSON.parse(response) as IAuth;
      const req = await getUser(user.userId, user.token);
      if (req.status === 200) {
        this.successLog();
      }
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
      this.loginBtn.updateLogStatus(this.stateLog.state);
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
