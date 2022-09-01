import { BASELINK, IWord } from '../api/Words';
import Control from '../common/control';
import icons from '../../assets/icons/sprite.svg';

import SVG from '../common/svgElement';

class StatisticAudio extends Control {
  container: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement | null,
    arr: Array<{word: IWord, status: boolean}>,
  ) {
    super(parentNode, 'div', 'statistic__audio');
    this.container = new Control(this.node, 'div', 'list_statistic');
    this.createStatistic(arr);
  }

  createLine(word: IWord, status: boolean) {
    const el = new Control(this.container.node, 'div', 'item');
    const img = new Control(el.node, 'div', 'icon');
    const audioIcon = new Control<HTMLImageElement>(el.node, 'img', 'icon audio');
    const audio = new Audio(`${BASELINK}/${word.audio}`);
    audioIcon.node.addEventListener('click', () => {
      audio.play();
    });

    const title = new Control<HTMLDivElement>(el.node, 'span', '', word.word);
    const Translate = new Control(el.node, 'span', '', word.wordTranslate);

    if (status) {
      const svg = new SVG(img.node, 'icon__true', `${icons}#true`);
      el.node.classList.add('success');
    } else {
      const svg = new SVG(img.node, 'icon__false', `${icons}#false`);
      el.node.classList.add('failed');
    }
    audioIcon.node.src = '../../assets/icons/volume.png';
  }

  createStatistic(arr: Array<{word: IWord, status: boolean}>) {
    arr.forEach((item) => this.createLine(item.word, item.status));
  }

  render() {
    return this.node;
  }
}

export default StatisticAudio;
