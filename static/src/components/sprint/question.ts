import Control from '../common/control'
import SVG from '../common/svgElement'
import icons from '../../assets/icons/sprite.svg'
import { BASELINK } from '../api/dbWords'

class Question extends Control{
  constructor(parentNode: HTMLElement | null, public word: string[]) {
    super(parentNode, 'div', 'sprint__question question')
    this.renderWord()
  }


  private renderWord() {
    const [ wordAudio, wordEngText, , wordRusText ] = this.word
    const wordSound = new SVG(this.node, 'sound', `${icons}#volume`)
    wordSound.svg.onclick = () => {
      const audio = new Audio(`${BASELINK}/${wordAudio}`);
      audio.play();
    }

    const wordEng = new Control(this.node, 'span', 'question__word', wordEngText)
    const points = new Control(this.node, 'span', 'question__word', wordRusText)
  }

  onAnswer (answer: boolean) {
    const [ , , rightWordRusText, wordRusText ] = this.word

    return (rightWordRusText === wordRusText) === answer
  }


  public render () {
    return this.node
  }
}

export default Question
