import { getWords, Word } from '../api/dbWords';
import Control from '../common/control';
import Signal from '../common/signal';
import GamePage from './gamePage';
import SprintState from './sprintState';
import StartPage from './startPage';

enum TextInner {
  preloader = `We're getting closer, get ready...`,
}

class Sprint extends Control {
  private preloader: Control;
  private words: Word[] = [];
  private state: SprintState

  constructor(parentNode: HTMLElement | null, onGoBook: Signal<string>) {
    super(parentNode, 'div', 'sprint');
    this.state = new SprintState();
    this.state.onPreload.add(this.renderPreloader.bind(this));
    onGoBook.add(this.state.setInitiator.bind(this.state));

    this.preloader = new Control(null, 'span', 'sprint__preloader',TextInner.preloader)

    const startPage = new StartPage(this.node, this.state);
  }

  private async renderPreloader(level: number) {

    this.node.append(this.preloader.node)
    const questions = await this.getQuestions(level)
    console.log(questions)
    this.preloader.destroy()
    const gamePage = new GamePage(this.node, this.state, questions);

  }

  private async getQuestions(level: number, page?: number) {
    this.words = await getWords({
      endpoint: '/words',
      gueryParams: {
        group: level,
        page: page || Math.floor(Math.random() * 30),
      },
    });

    return this.createQuestions();
  }

  private createQuestions(): string[][] {
    const wordsList = this.words.map((word) => [word.audio, word.word, word.wordTranslate]);

    const mixList = wordsList.map((word) => {
      if (Math.round(Math.random())) {
        return [...word, word[2]];
      }
      const randomIndex = Math.floor(Math.random() * wordsList.length);
      const randomWord = wordsList[randomIndex];
      return [...word, randomWord[2]];
    });

    return mixList;
  }
}

export default Sprint;
