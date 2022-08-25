import Words, { IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import Signal from '../common/signal';
import GamePage from './gamePage';
import SprintState from './sprintState';
import StartPage from './startPage';
import { randomSort } from '../common/functions'
import Logging, { IStateLog } from '../Logging';
import soundManager from '../utils/soundManager';

enum TextInner {
  preloader = `We're getting closer, get ready...`,
  error = `Something is wrong? try again...`
}

export interface IWordStat {
  wordId: string,
  answer: boolean
}

const COUNTPAGE = 30

class Sprint extends Control {
  private preloader: Control;
  private words: IWord[] = [];
  private state: SprintState
  private startPage: StartPage
  private gamePage: GamePage | null = null
  private questions: [IWord, string][] = [];

  constructor(
    private parentNode: HTMLElement | null, 
    private login: Logging,
    private onGoBook: Signal<string>
  ) {
    super(parentNode, 'div', 'sprint');
    this.state = new SprintState();
    this.state.onPreload.add(this.renderPreloader.bind(this));
    onGoBook.add(this.state.setInitiator.bind(this.state));

    this.preloader = new Control(null, 'span', 'sprint__preloader',TextInner.preloader)

    this.startPage = new StartPage(this.node, this.state, this.state.getInitiator());
    this.onFinish.add(this.recordStatToBD.bind(this))
  }

  public onFinish = new Signal<IWordStat[]>()

  private async renderPreloader(words: number[]) {
    const [group, page] = words
    this.node.append(this.preloader.node)

    if (this.state.getInitiator() === 'header') {
      this.words = await this.getWords(group)
    } else {
      //todo this.questions = await this.getQuestions(group, page)
    }
    
    this.preloader.destroy()
    this.gamePage = new GamePage(this.node, this.state, this.words, this.onFinish);  

  }

  private async getWords(level: number, page?: number) {
    try {
      if (page) {
        const words = await Words.getWords({
            group: level,
            page: page,
          });
        return randomSort(words)
        
      } else {
        const wordsAll = await Promise.all([...Array(COUNTPAGE).keys()].map((page) => {
          return Words.getWords({
              group: level,
              page: page,
            })
        }))

        return randomSort(wordsAll.flat())
      }
  
    } catch {
      this.preloader.node.textContent = TextInner.error
      setTimeout(() => {
        this.preloader.destroy()
        this.startPage = new StartPage(this.node, this.state, this.state.getInitiator());
      })
      return []
    }
    
  }

  private async recordStatToBD(wordsStat: IWordStat[]) {
    const stateLog = await this.login.checkStorageLogin()
    if (stateLog.state) {
      const userWordsAll = await Words.getUserWords(stateLog.userId, stateLog.token)

      const recordResult = await Promise.all(wordsStat.map(word => {
        const userWord = userWordsAll.find(userWord => userWord.optional.wordId === word.wordId)
        if (userWord) {
          return this.updateUserWord(stateLog, userWord, word.answer)
        } else {
          return this.createUserWord(stateLog, word)
        }
      }))    
    }
  }

  private async updateUserWord(stateLog: IStateLog, userWord: IUserWord, answer: boolean) {
    if (answer) {
      const isLearn = this.checkIsLearn(userWord)
      const date = new Date()
      return await Words.updateUserWord(stateLog.userId, stateLog.token, userWord.optional.wordId, {
        difficulty: isLearn ? 'easy' : userWord.difficulty,
        optional: {
          wordId: userWord.optional.wordId,
          сountRightAnswer: userWord.optional.сountRightAnswer + 1,
          countError: userWord.optional.countError,
          seriesRightAnswer: userWord.optional.seriesRightAnswer + 1,
          isLearn: isLearn,
          dataGetNew: userWord.optional.dataGetNew,
          dataLearn: (isLearn && isLearn !== userWord.optional.isLearn) ? date: undefined,
        }
      })
    } else {
      return await Words.updateUserWord(stateLog.userId, stateLog.token, userWord.optional.wordId, {
        difficulty: userWord.difficulty,
        optional: {
          wordId: userWord.optional.wordId,
          сountRightAnswer: userWord.optional.сountRightAnswer,
          countError: userWord.optional.countError + 1,
          seriesRightAnswer: 0,
          isLearn: false,
          dataGetNew: userWord.optional.dataGetNew,
        }
      })
    }
  }

  private async createUserWord(stateLog: IStateLog, word: IWordStat) {
    const date = new Date()

    if (word.answer) {
      return await Words.createUserWord(stateLog.userId, stateLog.token, word.wordId, {
        difficulty: 'easy',
        optional: {
          wordId: word.wordId,
          сountRightAnswer: 1,
          countError: 0,
          seriesRightAnswer: 1,
          isLearn: false,
          dataGetNew: date,
        }
      })
    } else {
      return await Words.createUserWord(stateLog.userId, stateLog.token, word.wordId, {
        difficulty: 'easy',
        optional: {
          wordId: word.wordId,
          сountRightAnswer: 0,
          countError: 1,
          seriesRightAnswer: 0,
          isLearn: false,
          dataGetNew: date,
        }
      })
    }
  }

  private checkIsLearn(userWord: IUserWord) {
    if (userWord.difficulty === 'easy') {
      if (userWord.optional.seriesRightAnswer + 1 >= 3) {
        return true
      }
    }

    if (userWord.difficulty === 'hard') {
      if (userWord.optional.seriesRightAnswer + 1 >= 5) {
        return true
      }
    }

    return userWord.optional.isLearn
  }

  public destroy() {
    if (this.gamePage) {
      this.gamePage.destroy()
    }
    
    super.destroy();
  }
}

export default Sprint;
