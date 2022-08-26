import { IWord } from '../api/Words';
import Control from '../common/control';

class StatisticAudio extends Control {
  container: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement | null,
    arr: Array<{word: IWord, status: 'failed' | 'success'}>,
  ) {
    super(parentNode, 'div', 'statistic__audio');
    this.container = new Control(this.node, 'div', 'list_statistic');
    this.createStatistic(arr);
  }

  createLine(word: IWord, status: 'failed' | 'success') {
    const el = new Control(this.container.node, 'div', 'item');
    const title = new Control<HTMLDivElement>(el.node, 'h3', '', word.word);
    const img = new Control<HTMLImageElement>(el.node, 'img', 'icon');
    if (status === 'success') {
      img.node.src = '../../assets/icons/success.png';
      el.node.classList.add('success');
    } else {
      img.node.src = '../../assets/icons/fail.png';
      el.node.classList.add('failed');
    }
  }

  createStatistic(arr: Array<{word: IWord, status: 'failed' | 'success'}>) {
    arr.forEach((item) => this.createLine(item.word, item.status));
  }

  render() {
    return this.node;
  }
}

export default StatisticAudio;