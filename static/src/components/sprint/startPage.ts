import Control from '../common/control'
import ButtonAnswer from './buttonAnswer'
import GameField from './gamePage'
import SprintState from './sprintState'

enum TextInner {
  titleStart = 'Вперед за сокровищами!',
  descriptionFirst = 
  `Успей собрать сокровища до начала прилива!!
  У тебя ровно 1 минута`,
  descriptionSecond = 
  `(Тренирует навык быстрого перевода с английского языка на русский. Выбирай соответствует ли перевод предложенному слову)`,
}

const COUNTLEVELS = 6

class StartPage extends Control{
 
  constructor(private parentNode: HTMLElement | null, private state: SprintState) {
    super(parentNode, 'div', 'sprint__start start')

    this.renderStartPage()
  }

  private renderStartPage() {
    const title = new Control(this.node, 'h2', 'start__title', TextInner.titleStart)
    const descrFirst = new Control(this.node, 'span', 'start__title', TextInner.descriptionFirst)
    const descrSecond = new Control(this.node, 'span', 'start__title', TextInner.descriptionSecond)

    const buttonWrap = new Control(this.node, 'div', 'start__button-wrap')
    const buttonList = [...Array(COUNTLEVELS).keys()].map(item => {
      const button = new ButtonAnswer(buttonWrap.node, 'start__button', (item + 1).toString())
      button.node.onclick = () => {
        new GameField(this.parentNode, this.state, item + 1)
        this.destroy()
      }

      return button
    })

  }
 
  public render () {
    return this.node
  }

  
}

export default StartPage
