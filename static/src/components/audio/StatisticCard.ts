import { IWord } from '../api/Words';
import Control from '../common/control';

class StatisticCard extends Control {
  successItem: Control<HTMLImageElement>;

  failedItem: Control<HTMLImageElement>;

  constructor(
    parentNode: HTMLElement | null,
    arr: Array<{word: IWord, status: 'failed' | 'success'}>,
  ) {
    super(parentNode, 'div', 'statistic__audio');
    this.successItem = new Control<HTMLImageElement>(this.node, 'img', 'icon');
    this.successItem.node.src = '../../assets/icons/success.png';
    this.failedItem = new Control<HTMLImageElement>(this.node, 'img', 'icon');
    this.failedItem.node.src = '../../assets/icons/success.png';
  }

  createStatistic() {
    this.node.append(this.successItem.node, this.failedItem.node);
  }
}

export default StatisticCard;
