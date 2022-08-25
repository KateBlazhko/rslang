import ButtonHref from './common/ButtonHref';
import ButtonLogging from './common/ButtonLogging';
import Control from './common/control';
import '../style/logging.scss';
import ModalLog from './ModalLog';
import Validator from './utils/Validator';
import { User, IAuth } from './api/User';

export interface IStateLog {
  state: boolean;
  userId: string;
  token: string
}

class Logging {
  private container: Control<HTMLElement>;

  private loginBtn: ButtonLogging;

  private profile: ButtonHref;

  private stateLog: IStateLog;

  private modal: ModalLog;

  constructor() {
    this.container = new Control<HTMLDivElement>(null, 'div', 'logging__container');
    this.stateLog = { state: false, userId: '', token: '' };
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
    const form = this.modal.formElements;
    if (email && password) {
      const res = await User.loginUser({
        email: form.email.value,
        password: form.password.value,
      });
      if (res.status === 200) {
        const user: IAuth = await (res as Response).json();
        localStorage.setItem('user', JSON.stringify(user));
        this.successLog(user);
      } else {
        this.modal.callErrorWindow(res.status);
      }
    }
  }

  async registerUser(email: boolean, password: boolean, name: boolean) {
    const form = this.modal.formElements;
    if (email && password && name) {
      const res = await User.createUser({
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
      });

      const log = await User.loginUser({
        email: form.email.value,
        password: form.password.value,
      });

      if (res.status === 200) {
        const user: IAuth = await (res as Response).json();
        localStorage.setItem('user', JSON.stringify(user));
        this.successLog(user);
      } else {
        this.modal.callErrorWindow(res.status);
      }
    }
  }

  successLog(user: IAuth) {
    Validator.removeAllWarning(this.modal.name, this.modal.email, this.modal.password);
    this.modal.formElements.background.destroy();
    this.stateLog = {
      state: true,
      userId: user.userId,
      token: user.token,
    };
    this.loginBtn.updateLogStatus(this.stateLog.state);
    this.accessStatistics();
  }

  unsuccessLog() {
    this.modal.formElements.background.destroy();
    this.stateLog = {
      state: false,
      userId: '',
      token: '',
    };
    this.loginBtn.updateLogStatus(this.stateLog.state);
    this.accessStatistics();
  }

  async checkStorageLogin() {
    const response = localStorage.getItem('user');
    if (response) {
      const user = JSON.parse(response) as IAuth;
      const req = await User.getUser(user.userId, user.token);
      if (req.status === 200) {
        this.successLog(user);
      } else {
        this.unsuccessLog();
      }
    } else {
      this.unsuccessLog();
    }

    return this.stateLog;
  }

  accessStatistics() {
    this.profile.node.addEventListener('click', (event) => {
      if (!this.stateLog.state) event.preventDefault();
    });
    if (!this.stateLog.state) {
      this.profile.node.textContent = 'U';
      if (window.location.hash.slice(1) === 'statistics') {
        window.location.hash = '#home';
      }
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
