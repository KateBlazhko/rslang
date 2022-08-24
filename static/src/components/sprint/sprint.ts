import { getWords, Word } from '../api/dbWords';
import Control from '../common/control';
import Signal from '../common/signal';
import GamePage from './gamePage';
import SprintState from './sprintState';
import StartPage from './startPage';
import { randomSort } from '../utils/functions'

enum TextInner {
  preloader = `We're getting closer, get ready...`,
  error = `Something is wrong? try again...`
}

const COUNTPAGE = 30

class Sprint extends Control {
  private preloader: Control;
  private words: Word[] = [];
  private state: SprintState
  private startPage: StartPage
  private questions: string[][] = [];

  constructor(parentNode: HTMLElement | null, onGoBook: Signal<string>) {
    super(parentNode, 'div', 'sprint');
    this.state = new SprintState();
    this.state.onPreload.add(this.renderPreloader.bind(this));
    onGoBook.add(this.state.setInitiator.bind(this.state));

    this.preloader = new Control(null, 'span', 'sprint__preloader',TextInner.preloader)

    this.startPage = new StartPage(this.node, this.state, this.state.getInitiator());
  }

  private async renderPreloader(words: number[]) {
    const [group, page] = words
    this.node.append(this.preloader.node)

    if (this.state.getInitiator() === 'header') {
      this.questions = await this.getQuestions(group)
    } else {
      //todo this.questions = await this.getQuestions(group, page)
    }
    
    this.preloader.destroy()
    const gamePage = new GamePage(this.node, this.state, this.questions);  
  
  }

  private async getQuestions(level: number, page?: number) {
    try {
      if (page) {
        const words = await getWords({
          endpoint: '/words',
          gueryParams: {
            group: level,
            page: page,
          },
        });
        this.words = randomSort(words)
        
      } else {
        const wordsAll = await Promise.all([...Array(COUNTPAGE).keys()].map((page) => {
          return getWords({
            endpoint: '/words',
            gueryParams: {
              group: level,
              page: page,
            },
          })
        }))

        this.words = randomSort(wordsAll.flat())
      }
  
      return this.createQuestions();
    } catch {
      this.preloader.node.textContent = TextInner.error
      setTimeout(() => {
        this.preloader.destroy()
        this.startPage = new StartPage(this.node, this.state, this.state.getInitiator());
      })
      return []
    }

    
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
