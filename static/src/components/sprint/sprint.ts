import Control from '../common/control';
import Signal from '../common/signal';
import SprintState from './sprintState';
import StartPage from './startPage';

class Sprint extends Control {
  constructor(parentNode: HTMLElement | null, onGoBook: Signal<string>) {
    super(parentNode, 'div', 'sprint');
    const state = new SprintState();
    onGoBook.add(state.setInitiator.bind(state));

    const startPage = new StartPage(this.node, state);
  }
}

export default Sprint;
