import Control from '../common/control'
import Signal from '../common/signal'
import { getWords, Word } from '../api/dbWords'
import SprintState from './sprintState'
import Timer from './timer'
import SVG from '../common/svgElement'
import icons from '../../assets/icons/sprite.svg'
import Question from './question'
import ButtonAnswer from './buttonAnswer'

enum TextInner {
  points = '0',
  buttonTrue = 'True',
  buttonFalse = 'False'
}

const TIME = 60

type Answer = Record<number, boolean>

class Sprint extends Control{
  private state: SprintState
  private correctAnswerSeries: number = 0
  private spintInner: Control
  private animationWrap: Control
  private indicatorList: SVG[]
  private buttonList: ButtonAnswer[]
  private pointsView: Control
  private questionWrap: Control
  private timer: Timer
  private results: Answer[] = []
  private rate: number = 1
  private countRightAnswer: number = 0
  private onGetAnswer: (answer: boolean) => void = () => {}

  constructor(parentNode: HTMLElement | null, onGoBook: Signal<string>) {
    super(parentNode, 'div', 'sprint')
    this.state = new SprintState()  
    onGoBook.add(this.state.setInitiator.bind(this.state))

    this.animationWrap = new Control(this.node, 'div', 'sprint__animation-wrap')

    this.spintInner = new Control(this.node, 'div', 'sprint__inner')

    this.timer = new Timer(this.spintInner.node, 'sprint__timer');

    this.indicatorList = this.renderIndicator()

    this.pointsView = this.renderPoints()

    this.questionWrap = new Control(this.spintInner.node, 'div', 'sprint__question-wrap')
    
    this.buttonList = this.renderButtons()
    this.init()
  }

  private async init() {
    this.indicatorList.forEach(indicator => {indicator.addClass('default')})

    const words = await getWords({
      endpoint: '/words',
      gueryParams: {
        page: 2,
        group: 0,
      }
    })

    const questions = this.getQuestions(words)

    this.buttonList.forEach(button => {
      button.node.onclick = () => {
        this.onGetAnswer(button.value)
      }
    })

    this.timer.start(TIME);
    this.timer.onTimeOut = ()=> {
      this.timer.stop()
      this.finish();
    }

    this.questionCycle(questions, 0);
  }

  private renderIndicator() {
    const indicatorWrap = new Control(this.spintInner.node, 'div', 'sprint__indicator-wrap')
    return [
      new SVG(indicatorWrap.node, 'sprint__indicator', `${icons}#ind0`),
      new SVG(indicatorWrap.node, 'sprint__indicator', `${icons}#ind1`),
      new SVG(indicatorWrap.node, 'sprint__indicator', `${icons}#ind2`)
    ]
  }

  private renderPoints() {
    const pointsWrap = new Control(this.spintInner.node, 'div', 'sprint__points-wrap')
    return new Control(pointsWrap.node, 'span', 'sprint__points', TextInner.points)
  }

  private renderButtons() {
    const buttonWrap = new Control(this.spintInner.node, 'div', 'sprint__button-wrap')

    return [
      new ButtonAnswer(
        buttonWrap.node, 
        'sprint__button sprint__button_false', 
        TextInner.buttonFalse,
        false
      ),
      new ButtonAnswer(
        buttonWrap.node, 
        'sprint__button sprint__button_true', 
        TextInner.buttonTrue,
        true
      )
    ]
  }

  private getQuestions(word: Word[]): string[][] {
    const wordsList = word.map(word => [word.word, word.wordTranslate])

    const mixList = wordsList.map(word => {
      if (Math.round(Math.random())) {
        return [...word, word[1]]
      } else {
        const randomIndex = Math.floor(Math.random() * wordsList.length)
        const randomWord = wordsList[randomIndex]
        return [...word, randomWord[1]]
      }
    })

    return mixList

  }

  private questionCycle(questions: string[][], indexQuestion: number){

    if (indexQuestion >= questions.length){ 
      this.finish();
      return;
    }

    const question = new Question(this.questionWrap.node, questions[indexQuestion]);

    this.onGetAnswer = (value: boolean) => {
      const result = question.onAnswer(value)

      if (result) {
        console.log(this.rate)
        this.countRightAnswer += 10 * this.rate
        this.pointsView.node.textContent = this.countRightAnswer.toString();

        this.correctAnswerSeries++
        this.checkAnswerSeries(this.correctAnswerSeries)
        // SoundManager.ok();
      } else {
        this.resetAnswerSeries()
        // SoundManager.fail();
      }

      this.results.push({[indexQuestion]: result})
      question.destroy();
      this.questionCycle(questions, indexQuestion + 1);
    }
  }

  private checkAnswerSeries(correctAnswerSeries: number) {
    this.indicatorList[correctAnswerSeries - 1].delClass('default')
    if (correctAnswerSeries === 3) {
      this.rate++
      setTimeout(() => {
        this.correctAnswerSeries = 0
        this.indicatorList.forEach(indicator => {indicator.addClass('default')})
      }, 1000)
    }
  }

  private resetAnswerSeries() {
    this.indicatorList.forEach(indicator => {indicator.addClass('default')})
    this.correctAnswerSeries = 0
    this.rate = 1
  }
 
  public render () {
    return this.node
  }

  public destroy(){
    this.timer.stop();
    super.destroy();
  }

  private finish() {
    this.animationWrap.destroy()
    this.spintInner.destroy()
    const result = new Control(this.node, 'div', 'sprint__result', 'result')
  }
}

export default Sprint
