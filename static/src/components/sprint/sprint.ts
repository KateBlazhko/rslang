import Control from '../common/control'
import Signal from '../common/signal'
import { getWords, Word } from '../api/dbWords'
import SprintState from './sprintState'
import Timer from './timer'
import SVG from '../common/svgElement'
import icons from '../../assets/icons/sprite.svg';
import Question from './question'
import ButtonAnswer from './buttonAnswer'
import { soundManager } from '../common/soundManager'

enum TextInner {
  points = '0',
  buttonTrue = 'True',
  buttonFalse = 'False',
  titleStart = 'Вперед за сокровищами!',
  descriptionFirst = 
  `Успей получить сокровища до начала прилива!!
  У тебя ровно 1 минута`,
  descriptionSecond = 
  `(Тренирует навык быстрого перевода с английского языка на русский. Выбирай соответствует ли перевод предложенному слову)`,
  titleResult = 'Йо-хо-хо! Вот это результат!',
}

const TIME = 12
const COUNTLEVELS = 6

class Sprint extends Control{
  private state: SprintState
  private correctAnswerSeries: number = 0
  private spintInner: Control
  private animationWrap: Control | null = null
  private pointsView: Control
  private questionWrap: Control
  private indicatorWrap: Control
  private rateWrap: Control
  private timerWrap: Control
  private buttonReturn: Control
  private indicatorList: SVG[] = []
  private iconRateList: SVG[] = []
  private words: Word[] = []
  private buttonList: ButtonAnswer[]
  private timer: Timer
  private results: Boolean[] = []
  private rate: number = 1
  private countRightAnswer: number = 0
  private onGetAnswer: (answer: boolean) => void = () => {}

  constructor(parentNode: HTMLElement | null, onGoBook: Signal<string>) {
    super(parentNode, 'div', 'sprint')
    this.state = new SprintState()  
    onGoBook.add(this.state.setInitiator.bind(this.state))

    this.buttonReturn = new Control(null, 'div', 'sprint__button sprint__button_return')
    this.buttonReturn.node.onclick = () => {
      new Sprint(parentNode, onGoBook)
      this.destroy()
    }

    this.spintInner = new Control(null, 'div', 'sprint__inner')

    this.timerWrap = new Control(this.spintInner.node, 'div', 'sprint__timer-wrap')
    this.timer = new Timer(this.timerWrap.node, 'sprint__timer')

    this.indicatorWrap = new Control(this.spintInner.node, 'div', 'sprint__indicator-wrap')

    this.rateWrap = new Control(this.spintInner.node, 'div', 'sprint__rate-wrap')

    this.pointsView = this.renderPoints()
    this.questionWrap = new Control(this.spintInner.node, 'div', 'sprint__question-wrap')
    this.buttonList = this.renderButtons()

    this.renderStartPage()
  }

  private renderStartPage() {
    const spintStart = new Control(this.node, 'div', 'sprint__start-game start-game')
    const title = new Control(spintStart.node, 'h2', 'start-game__title', TextInner.titleStart)
    const descrFirst = new Control(spintStart.node, 'span', 'start-game__title', TextInner.descriptionFirst)
    const descrSecond = new Control(spintStart.node, 'span', 'start-game__title', TextInner.descriptionSecond)

    const buttonWrap = new Control(spintStart.node, 'div', 'start-game__button-wrap')
    const buttonList = [...Array(COUNTLEVELS).keys()].map(item => {
      const button = new ButtonAnswer(buttonWrap.node, 'start-game__button', (item + 1).toString())
      button.node.onclick = () => {
        this.init(item)
        spintStart.destroy()
        this.node.append(this.spintInner.node)
      }

      return button
    })

  }

  private async getQuestions(level: number, page?: number) {
    this.words = await getWords({
      endpoint: '/words',
      gueryParams: {
        group: level,
        page: page? page : Math.random() * 6
      }
    })

    return this.createQuestions(this.words)

  }

  private async init(level: number, page?: number) {
    const questions = await this.getQuestions(level, page)

    this.spintInner.node.append(this.buttonReturn.node)
    this.renderSoundSettings()

    this.indicatorList = this.renderIndicator()
    this.indicatorList.forEach(indicator => {indicator.addClass('default')})

    this.renderRate()

    this.buttonList.forEach(button => {
      button.node.onclick = () => {
        if (button.value !== undefined)
          this.onGetAnswer(button.value)
      }
    })

    this.animationWrap = new Control(this.node, 'div', 'sprint__animation-wrap')

    this.timer.start(TIME);
    this.timer.onTimeFinishing = () => {
      this.timerWrap.node.classList.add('finishing')

      if (this.state.getSoundPlay()) {
        soundManager.playTimer()
        return true
      }
      return false
    }

    this.timer.onTimeOut = ()=> {
      this.timer.stop()
      setTimeout(() => {
        this.finish();
      }, 1000);
    }

    this.questionCycle(questions, 0);
  }

  private renderSoundSettings() {
    const soundOnWrap = new Control(this.spintInner.node, 'div', 'sprint__soundOn-wrap')
    const soundOn = new SVG(soundOnWrap.node, 'sound', `${icons}#volume`);
    const soundOff = new SVG(null, 'sound', `${icons}#mute`);

    soundOnWrap.node.onclick = () => {
      this.state.setSoundPlay(!this.state.getSoundPlay())
      const curentState = this.state.getSoundPlay()

      if (curentState) {
        if (soundOff) soundOff.destroy()
        soundOnWrap.node.append(soundOn.svg)
        soundManager.restartPlayTimer()
      } else {
        if (soundOn) soundOn.destroy()
        soundOnWrap.node.append(soundOff.svg)
        soundManager.stopPlayTimer()
      }
    }
  }

  private renderIndicator() {
    return [
      new SVG(this.indicatorWrap.node, 'sprint__indicator', `${icons}#ind0`),
      new SVG(this.indicatorWrap.node, 'sprint__indicator', `${icons}#ind1`),
      new SVG(this.indicatorWrap.node, 'sprint__indicator', `${icons}#ind2`)
    ]
  }

  private renderRate() {
    this.iconRateList.push(new SVG(this.rateWrap.node, 'sprint__rate', `${icons}#rate`))
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

  private createQuestions(word: Word[]): string[][] {
    const wordsList = word.map(word => [word.audio, word.word, word.wordTranslate])

    const mixList = wordsList.map(word => {
      if (Math.round(Math.random())) {
        return [...word, word[2]]
      } else {
        const randomIndex = Math.floor(Math.random() * wordsList.length)
        const randomWord = wordsList[randomIndex]
        return [...word, randomWord[2]]
      }
    })

    return mixList
  }

  private questionCycle(questions: string[][], indexQuestion: number){

    if (indexQuestion >= questions.length){ 
      this.timer.stop()
      this.finish();
      return;
    }

    const question = new Question(this.questionWrap.node, questions[indexQuestion]);

    this.onGetAnswer = (value: boolean) => {
      const result = question.onAnswer(value)

      if (result) {
        this.countRightAnswer += 10 * this.rate
        this.pointsView.node.textContent = this.countRightAnswer.toString();

        this.correctAnswerSeries++
        this.checkAnswerSeries(this.correctAnswerSeries)

        if (this.state.getSoundPlay()) soundManager.playOk();
      } else {
        this.resetAnswerSeries()

        if (this.state.getSoundPlay()) soundManager.playFail();
      }

      this.results.push(result)
      question.destroy();
      this.questionCycle(questions, indexQuestion + 1);
    }
  }

  private checkAnswerSeries(correctAnswerSeries: number) {
    this.indicatorList[correctAnswerSeries - 1].delClass('default')
    if (correctAnswerSeries === 3) {
      if (this.rate < 6) {
        this.rate++
        this.renderRate()
      }
      setTimeout(() => {
        this.correctAnswerSeries = 0
        this.indicatorList.forEach(indicator => {indicator.addClass('default')})
      }, 1000)
    }
  }

  private resetAnswerSeries() {
    this.iconRateList.forEach(svg => svg.destroy())
    this.indicatorList.forEach(indicator => {indicator.addClass('default')})
    this.correctAnswerSeries = 0
    this.rate = 1
  }
 
  public render () {
    return this.node
  }

  public destroy(){
    this.timer.stop();
    soundManager.stopPlayTimer()
    super.destroy();
  }

  private finish() {
    if (this.animationWrap) this.animationWrap.destroy()
    this.spintInner.destroy()
    this.renderResult()
  }

  private renderResult() {
    const result = new Control(this.node, 'div', 'sprint__result result')
    const title = new Control(result.node, 'h2', 'result__title', TextInner.titleResult)
    result.node.append(this.buttonReturn.node)

    const tableWrap = new Control(result.node, 'div', 'result__table')
    const resultList = this.words.map((word, index) => {
      const resultRow = new Control(tableWrap.node, 'div', 'result__row')
      if (this.results[index])
        new SVG(resultRow.node, 'result__true', `${icons}#true`)
      else         
        new SVG(resultRow.node, 'result__false', `${icons}#false`)

      const wordSound = new SVG(resultRow.node, 'result__sound', `${icons}#volume`)
      wordSound.svg.onclick = () => {
        //todo sound wordAudio
      }
      const wordData = new Control(
        resultRow.node, 
        'span',
        'result__text', 
        `${word.word}  ${word.transcription}  ${word.wordTranslate}`
      )
    })
  }
}

export default Sprint
