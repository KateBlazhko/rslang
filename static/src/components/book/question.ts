import Control from '../common/control';
import SVG from '../common/svgElement';
import { BASELINK, IWord } from '../api/Words';
import SprintState from './bookState';

class Question extends Control {
  // private wordAudio: string;

  private wordSound: SVG | null = null;

  private wordAudioWrap: Control;

  constructor(
    parentNode: HTMLElement | null,
    public word: [IWord, string],
    private state: SprintState,
  ) {
    super(parentNode, 'div', 'sprint__question question');
    this.state.onSoundOn.add(this.renderSoundIcon.bind(this));
    this.wordAudioWrap = new Control(this.node, 'div', 'question__sound-wrap');
    this.renderSoundIcon(this.state.getSoundPlay());

    this.renderWord();
  }

  private renderWord() {
    const [word, wordRusText] = this.word;
    const wordEng = new Control(this.node, 'span', 'question__word', word.word);
    const points = new Control(this.node, 'span', 'question__word', wordRusText);
  }

  renderSoundIcon(isSoundOn: boolean) {
    const [word] = this.word;

    if (this.wordSound) this.wordSound.destroy();
  }

  onAnswer(answer: boolean) {
    const [word, wordRusText] = this.word;

    return (word.wordTranslate === wordRusText) === answer;
  }

  public render() {
    return this.node;
  }
}

export default Question;
