import ButtonHref from './common/ButtonHref';
import ButtonLogging from './common/ButtonLogging';
import Control from './common/control';
import '../style/logging.scss';
import ModalLog from './ModalLog';
import createUser from './api/dbLoging';
import { getWords } from './api/dbWords';

class Logging {
  container: Control<HTMLElement>;

  loggingBtn: ButtonLogging;

  profile: ButtonHref;

  stateLog: { state: boolean; };

  modal: ModalLog;

  constructor() {
    this.container = new Control<HTMLDivElement>(null, 'div', 'logging__container');
    this.stateLog = { state: true };
    this.loggingBtn = new ButtonLogging<HTMLButtonElement>(this.container.node, false);
    this.profile = new ButtonHref(this.container.node, '#statistics', 'U', 'profile');
    this.accessStatistics();
    this.modal = new ModalLog();
    this.addCallModal();
    this.listenBtn();
  }

  listenBtn() {
    this.modal.formElements.submit.node.addEventListener('click', () => {
      this.registrationMethod();
    });
  }

  async registrationMethod() {
    await createUser({
      name: this.modal.formElements.name.node.value,
      email: this.modal.formElements.email.node.value,
      password: this.modal.formElements.password.node.value,
    });
  }

  accessStatistics() {
    this.profile.node.addEventListener('click', (event) => {
      if (!this.stateLog.state) event.preventDefault();
      this.profile.node.textContent = 'U';
    });
    this.profile.node.textContent = 'A';
  }

  addCallModal() {
    this.loggingBtn.node.addEventListener('click', () => {
      this.modal.callModal();
    });
  }

  get node() {
    return this.container.node;
  }
}

export default Logging;
