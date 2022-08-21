import Control from '../common/control'
import { Word } from '../api/dbWords'
import SprintState from './sprintState'
import SVG from '../common/svgElement'
import icons from '../../assets/icons/sprite.svg';
import StartPage from './startPage'

enum TextInner {
  titleResult = 'Йо-хо-хо! Вот это результат!',
}

class ResultPage extends Control{
  private buttonReturn: Control
  private tableWrap: Control

  constructor(
    parentNode: HTMLElement | null, 
    private state: SprintState, 
    private words: Word[],
    private results: Boolean[]
  ) {

    super(parentNode, 'div', 'sprint__result result')

    this.buttonReturn = new Control(this.node, 'div', 'sprint__button sprint__button_return')
    this.buttonReturn.node.onclick = () => {
      new StartPage(parentNode, state)
      this.destroy()
    }

    const title = new Control(this.node, 'h2', 'result__title', TextInner.titleResult)
    this.tableWrap = new Control(this.node, 'div', 'result__table')
    this.renderResult()
  }

  private renderResult() {

    const resultList = this.words.map((word, index) => {
      const resultRow = new Control(this.tableWrap.node, 'div', 'result__row')
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

export default ResultPage
