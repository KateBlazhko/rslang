import { IWord } from '../api/Words';
import Control from '../common/control';

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
    const title = new Control<HTMLDivElement>(el.node, 'h3', '', word.word);
    const audioIcon = new Control<HTMLImageElement>(el.node, 'img', 'icon audio');
    const audio = new Audio(`http://localhost:3000/${word.audio}`);
    const img = new Control<HTMLImageElement>(el.node, 'img', 'icon');
    audioIcon.node.addEventListener('click', () => {
      audio.play();
    });
    if (status) {
      img.node.src = '../../assets/icons/success.png';
      el.node.classList.add('success');
    } else {
      img.node.src = '../../assets/icons/fail.png';
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
