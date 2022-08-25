import Control from '../common/control';
import { BASELINK, IWord } from '../api/Words';
import SprintState from './sprintState';
import SVG from '../common/svgElement';
import icons from '../../assets/icons/sprite.svg';
import StartPage from './startPage';

// enum TextInner {
//   titleResult = 'Йо-хо-хо! Вот это результат!',
// }

enum TextInner {
  titleResult = 'Yoo-hoo-hoo! What a result!',
}

class ResultPage extends Control {
  // private settingsSoundWrap: Control;

  private buttonReturn: Control;

  private tableWrap: Control;

  private settingsSound: SVG | null = null;

  private wordSoundList: SVG[] = [];

  private audiotList;

  constructor(
    parentNode: HTMLElement | null,
    private state: SprintState,
    private words: IWord[],
    private results: Boolean[],
  ) {
    super(parentNode, 'div', 'sprint__result result');
    // this.state.onSoundOn.add(this.renderSoundSettings.bind(this));
    // this.state.onSoundOn.add(this.renderSoundIcons.bind(this));

    // this.settingsSoundWrap = new Control(this.node, 'div', 'sound__wrap');
    // this.renderSoundSettings(this.state.getSoundPlay());

    this.buttonReturn = new Control(this.node, 'div', 'sprint__button sprint__button_return');
    this.buttonReturn.node.onclick = () => {
      const page = new StartPage(parentNode, this.state, this.state.getInitiator());
      this.destroy();
    };

    const title = new Control(this.node, 'h2', 'result__title', TextInner.titleResult);

    this.tableWrap = new Control(this.node, 'div', 'result__table');
    this.audiotList = this.renderResult();

    this.renderSoundIcons(this.state.getSoundPlay());
  }

  private renderResult() {
    const answers = this.words.filter((_word, index) => this.results[index] !== undefined);

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
        const wordSound = new SVG(item.container, 'sound', `${icons}#volume`);

        wordSound.svg.onclick = () => {
          const audio = new Audio(`${BASELINK}/${item.audio}`);
          if (isSoundOn) audio.play();
        };
        return wordSound;
      }
      return new SVG(item.container, 'sound', `${icons}#mute`);
    });
  }

  // private renderSoundSettings(isSoundOn: boolean) {
  //   if (this.settingsSound) this.settingsSound.destroy();

  //   if (isSoundOn) {
  //     this.settingsSound = new SVG(this.settingsSoundWrap.node, 'sound', `${icons}#volume`);
  //   } else {
  //     this.settingsSound = new SVG(this.settingsSoundWrap.node, 'sound', `${icons}#mute`);
  //   }

  //   this.settingsSound.svg.onclick = () => {
  //     this.state.setSoundPlay(!this.state.getSoundPlay());
  //   };
  // }
}

export default ResultPage;
