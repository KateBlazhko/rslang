import Control from '../common/control';
import { BASELINK, IWord } from '../api/Words';
import SprintState from './bookState';
import SVG from '../common/svgElement';
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
      const page = new StartPage(parentNode, this.state);
      this.destroy();
    };

    const title = new Control(this.node, 'h2', 'result__title', TextInner.titleResult);

    this.tableWrap = new Control(this.node, 'div', 'result__table');
    this.audiotList = this.renderResult();

  }

  private renderResult() {
    const answers = this.words.filter((_word, index) => this.results[index] !== undefined);

    return answers.map((word, index) => {
      const resultRow = new Control(this.tableWrap.node, 'div', 'result__row');

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
}

export default ResultPage;
