import Control from '../common/control';
import SVG from '../common/svgElement';
import icons from '../../assets/icons/sprite.svg';
import { BASELINK } from '../api/dbWords';
import SprintState from './sprintState';

class Question extends Control {
  private wordAudio: string;

  private wordSound: SVG | null = null;

  private wordAudioWrap: Control;

  constructor(parentNode: HTMLElement | null, private word: string[], private state: SprintState) {
    super(parentNode, 'div', 'sprint__question question');
    this.state.onSoundOn.add(this.renderSoundIcon.bind(this));
    this.wordAudioWrap = new Control(this.node, 'div', 'question__sound-wrap');
    [this.wordAudio] = this.word;
    this.renderSoundIcon(this.state.getSoundPlay());

    this.renderWord();
  }

  private renderWord() {
    const [, wordEngText, , wordRusText] = this.word;
    const wordEng = new Control(this.node, 'span', 'question__word', wordEngText);
    const points = new Control(this.node, 'span', 'question__word', wordRusText);
  }

  renderSoundIcon(isSoundOn: boolean) {
    if (this.wordSound) this.wordSound.destroy();

    if (this.wordAudio && isSoundOn) {
      this.wordSound = new SVG(this.wordAudioWrap.node, 'sound', `${icons}#volume`);
      this.wordSound.svg.onclick = () => {
        const audio = new Audio(`${BASELINK}/${this.wordAudio}`);
        if (isSoundOn) audio.play();
      };
    } else {
      this.wordSound = new SVG(this.wordAudioWrap.node, 'sound', `${icons}#mute`);
    }
  }

  onAnswer(answer: boolean) {
    const [, , rightWordRusText, wordRusText] = this.word;

    return (rightWordRusText === wordRusText) === answer;
  }

  public render() {
    return this.node;
  }
}

export default Question;
