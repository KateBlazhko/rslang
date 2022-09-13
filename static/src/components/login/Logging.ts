import ButtonHref from '../common/ButtonHref';
import ButtonLogging from '../common/ButtonLogging';
import Control from '../common/control';
import ModalLog from './ModalLog';
import Validator from '../utils/Validator';
import { User, IAuth, IToken } from '../api/User';
import Stats from '../api/Stats';
import { adapterDate } from '../utils/functions';
import Signal from '../common/signal';

export interface IStateLog {
  state: boolean;
  userId: string;
  token: string
}

class Logging {
  private container: Control<HTMLElement>;

  public loginBtn: ButtonLogging;

  private profile: ButtonHref;

  private stateLog: IStateLog;

  public modal: ModalLog;

  setPage: null | (() => void);

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
    this.setPage = null;
  }

  public onLogin = new Signal<boolean>();

  // eslint-disable-next-line class-methods-use-this, consistent-return
  getEvent(func?: () => void) {
    if (func) {
      this.setPage = func;
    }
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
        localStorage.setItem('userDream', JSON.stringify(user));
        this.successLog();
        this.saveState(user);
        this.onLogin.emit(true);
      } else {
        this.modal.callErrorWindow(res.status);
      }
    }
    this.setPage!();
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
        const user: IAuth = await (log as Response).json();
        localStorage.setItem('userDream', JSON.stringify(user));
        this.successLog();
        this.saveState(user);
        await this.createStats();
      } else {
        this.modal.callErrorWindow(res.status);
      }
    }
    this.setPage!();
  }

  async createStats() {
    const date = new Date();
    // date.setDate(date.getDate() - 1)

    await Stats.updateStat(this.stateLog.userId, this.stateLog.token, {
      learnedWords: 0,
      optional: {
        dateReg: adapterDate(date),
        sprint: {
          newWords: 0,
          сountRightAnswer: 0,
          countError: 0,
          maxSeriesRightAnswer: 0,
          dateLast: adapterDate(date),
        },
        audio: {
          newWords: 0,
          сountRightAnswer: 0,
          countError: 0,
          maxSeriesRightAnswer: 0,
          dateLast: adapterDate(date),
        },
        general: {
          newWords: {
            [adapterDate(date)]: 0,
          },
          learnedWords: {
            [adapterDate(date)]: 0,
          },
        },
      },
    });
  }

  successLog() {
    Validator.removeAllWarning(this.modal.name, this.modal.email, this.modal.password);
    this.modal.formElements.background.destroy();
    this.stateLog.state = true;
    this.loginBtn.updateLogStatus(this.stateLog.state);
    this.accessStatistics();
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  async getNewToken() {
    const response = localStorage.getItem('userDream');
    const user = JSON.parse(response!) as IAuth;

    const res = await User.getToken(user.userId, user.refreshToken);
    if (res instanceof Response) {
      const newToken = await res.json() as IToken;
      user.token = newToken.token;
      user.refreshToken = newToken.refreshToken;
      localStorage.setItem('userDream', JSON.stringify(user));
      return user;
    }
  }

  async checkStorageLogin() {
    const response = localStorage.getItem('userDream');
    if (response) {
      let user = JSON.parse(response) as IAuth;
      const req = await User.getUser(user.userId, user.token);
      if (req.status === 401) {
        const newUs = await this.getNewToken();
        if (newUs) user = newUs;
        this.successLog();
        this.saveState(user);
      } else if (req.status === 200) {
        this.successLog();
        this.saveState(user);
      } else {
        this.stateLog = { state: false, token: '', userId: '' };
        this.loginBtn.updateLogStatus(this.stateLog.state);
        this.accessStatistics();
      }
    }
    return this.stateLog;
  }

  saveState(user: IAuth) {
    this.stateLog.token = user.token;
    this.stateLog.userId = user.userId;
  }

  accessStatistics() {
    this.profile.node.addEventListener('click', (event) => {
      if (!this.stateLog.state) event.preventDefault();
    });
    if (!this.stateLog.state) {
      this.profile.node.classList.remove('login');
      // this.profile.node.textContent = 'U';
      if (window.location.hash.slice(1) === 'statistics') {
        window.location.hash = '#home';
      }
    } else {
      this.profile.node.classList.add('login');
      // this.profile.node.textContent = 'A';
    }
  }

  outModalBtnListen() {
    this.modal.yesBtn.node.addEventListener('click', () => {
      this.stateLog = { state: false, token: '', userId: '' };
      this.loginBtn.updateLogStatus(this.stateLog.state);
      this.accessStatistics();
      localStorage.removeItem('userDream');
      this.modal.formElements.background.destroy();
      window.location.hash = '#home';
      this.onLogin.emit(false);
    });
    this.modal.noBtn.node.addEventListener('click', () => {
      this.modal.formElements.background.destroy();
    });
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
