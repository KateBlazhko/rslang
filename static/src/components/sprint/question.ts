import Control from '../common/control'

class Question extends Control{
  constructor(parentNode: HTMLElement | null, public word: string[]) {
    super(parentNode, 'div', 'sprint__question')
    this.renderWord()
  }


  private renderWord() {
    const [ wordEngText, , wordRusText ] = this.word

    const wordWrap = new Control(this.node, 'div', 'sprint__word-wrap')
    const wordEng = new Control(wordWrap.node, 'span', 'sprint__word', wordEngText)
    const points = new Control(wordWrap.node, 'span', 'sprint__word', wordRusText)
  }

  onAnswer (answer: boolean) {
    const [ , rightWordRusText, wordRusText ] = this.word

    return (rightWordRusText === wordRusText) === answer
  }


  public render () {
    return this.node
  }
}

export default Question
