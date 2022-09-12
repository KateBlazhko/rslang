import Control from '../common/control';
import { IWord } from '../api/Words';
import SprintState from './sprintState';
import SVG from '../common/svgElement';
import icons from '../../assets/icons/sprite.svg';
import StartPage from './startPage';
import BASELINK from '../constants/url';

// enum TextInner {
//   titleResult = 'Йо-хо-хо! Вот это результат!',
// }

enum TextInner {
  titleResult = 'Yoo-hoo-hoo! What a result!',
  titleText = 'It seems not to be anything to teach you.',

}

class ResultPage extends Control {

  private buttonReturn: Control;

  private tableWrap: Control;

  private settingsSound: SVG | null = null;

  private wordSoundList: Control<HTMLImageElement>[] = [];

  private audiotList;

  constructor(
    parentNode: HTMLElement | null,
    private state: SprintState,
    private words: IWord[],
    private results: Boolean[],
  ) {
    super(parentNode, 'div', 'sprint__result result');

    this.buttonReturn = new Control(this.node, 'div', 'sprint__button sprint__button_return');
    this.buttonReturn.node.onclick = () => {
      const page = new StartPage(parentNode, this.state);
      this.destroy();
    };

    const title = new Control(this.node, 'h2', 'result__title', TextInner.titleResult);

    this.tableWrap = new Control(this.node, 'div', 'result__table');
    this.audiotList = this.renderResult();

    this.renderSoundIcons(this.state.getSoundPlay());

    // document.onkeydown = (e) => false;
  }

  private renderResult() {
    const answers = this.words.filter((_word, index) => this.results[index] !== undefined);

    if (answers.length === 0) {
      const text = new Control(this.tableWrap.node, 'span', 'result__no-answers', TextInner.titleText);
      return [];
    }

    return answers.map((word, index) => {
      const resultRow = new Control(this.tableWrap.node, 'div', 'result__row');
      const icon = this.results[index]
        ? new SVG(resultRow.node, 'result__true', `${icons}#true`)
        : new SVG(resultRow.node, 'result__false', `${icons}#false`);

      const wordAudioWrap = new Control(resultRow.node, 'div', 'result__sound-wrap');

      const wordData = new Control(
        resultRow.node,
        'span',
        'result__text',
        `${word.word}  ${word.transcription}  ${word.wordTranslate}`,
      );

      return {
        audio: word.audio,
        container: wordAudioWrap.node,
      };
    });
  }

  renderSoundIcons(isSoundOn: boolean) {
    this.wordSoundList.forEach((sound) => sound.destroy());

    this.wordSoundList = this.audiotList.map((item) => {
      if (item.audio && isSoundOn) {
        const wordSound = new Control<HTMLImageElement>(item.container, 'img', 'sound');
        wordSound.node.src = './assets/icons/volume.png';

        wordSound.node.onclick = () => {
          const audio = new Audio(`${BASELINK}/${item.audio}`);
          if (isSoundOn) audio.play();
        };
        return wordSound;
      }
      const wordSound = new Control<HTMLImageElement>(item.container, 'img', 'sound');
      wordSound.node.src = './assets/icons/mute.png';
      return wordSound;
    });
  }
}

export default ResultPage;
