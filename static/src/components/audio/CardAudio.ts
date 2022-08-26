import { IWord } from '../api/Words';
import Control from '../common/control';

class CardAudio extends Control {
  container: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement | null,
    value: { word: number },
    arrWord: Array<IWord>,
  ) {
    super(parentNode, 'div', 'audio_call__card');
    this.container = new Control(this.node);
  }
}

export default CardAudio;
