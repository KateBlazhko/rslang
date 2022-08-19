import ButtonHref from './common/ButtonHref';
import ButtonLogging from './common/ButtonLogging';
import Control from './common/control';
import '../style/logging.scss';
import ModalLog from './ModalLog';
import { createUser, loginUser } from './api/dbLoging';
import { getWords } from './api/dbWords';

class Logging {
  container: Control<HTMLElement>;

  loginBtn: ButtonLogging;

  profile: ButtonHref;

  stateLog: { state: boolean; };

  modal: ModalLog;

  constructor() {
    this.container = new Control<HTMLDivElement>(null, 'div', 'logging__container');
    this.stateLog = { state: false };
    this.loginBtn = new ButtonLogging<HTMLButtonElement>(this.container.node, this.stateLog.state);
    this.profile = new ButtonHref(this.container.node, '#statistics', '', 'profile');
    this.accessStatistics();
    this.modal = new ModalLog();
    this.addCallModal();
    this.listenSubmit();
  }

  listenSubmit() {
    this.modal.formElements.form.node.addEventListener('click', (e) => e.preventDefault());
    this.modal.formElements.submit.node.addEventListener('click', () => {
      if (!this.stateLog.state) this.registrationMethod();
    });
  }

  async registrationMethod() {
    if (this.modal.formElements.state === 'registration') {
      await createUser({
        name: this.modal.formElements.name.node.value,
        email: this.modal.formElements.email.node.value,
        password: this.modal.formElements.password.node.value,
      });
    } else {
      await loginUser({
        email: this.modal.formElements.email.node.value,
        password: this.modal.formElements.password.node.value,
      });
    }
    this.modal.clearInput();
    this.modal.formElements.background.destroy();
    this.stateLog.state = true;
    this.loginBtn.checkStateLog(this.stateLog.state);
    this.accessStatistics();
  }

  accessStatistics() {
    this.profile.node.addEventListener('click', (event) => {
      if (!this.stateLog.state) event.preventDefault();
    });
    if (!this.stateLog.state) this.profile.node.textContent = 'U';
    else this.profile.node.textContent = 'A';
  }

  addCallModal() {
    this.loginBtn.node.addEventListener('click', () => {
      if (!this.stateLog.state) {
        this.modal.callModal();
      } else {
        this.stateLog.state = false;
        this.loginBtn.checkStateLog(this.stateLog.state);
        this.accessStatistics();
      }
    });
  }

  get node() {
    return this.container.node;
  }
}

export default Logging;
