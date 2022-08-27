import Words, { IWord } from '../api/Words';
import Control from '../common/control';
import { shufflePage, shuffleArrayPage } from '../common/shufflePage';
import CardAudio from './CardAudio';
import StartPageAudio from './startPage';
import StatisticAudio from './StatisticAudio';

interface ICardAudio {
    value: number;
    node: HTMLButtonElement;
    word: IWord;
}
class GameAudio extends Control {
  arrWords: IWord[];

  value: { word: number; };

  progress: Control<HTMLElement>;

  arrWordsStatus: Array<{word: IWord, status: 'failed' | 'success'}>;

  repeat: Control<HTMLImageElement>;

  startPage: () => void;

  constructor(start: () => void) {
    super(null, 'div', 'game__page__audio');
    this.repeat = new Control<HTMLImageElement>(this.node, 'img', 'arrow_img', '');
    this.startPage = start;
    this.progress = new Control(this.node, 'div', 'audio_call__progress', 'Your Progress');
    this.repeat.node.src = '../../assets/icons/arrow.png';
    this.arrWords = [];
    this.arrWordsStatus = [];
    this.value = { word: 0 };
    this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
    this.repeatListen();
  }

  repeatListen() {
    this.repeat.node.addEventListener('click', () => {
      document.onkeydown = () => {};
      this.startPage();
    });
  }

  static async getAllWords(difficult: string) {
    const wordsAll = await Promise.all(shufflePage().map((page) => Words.getWords({
      group: difficult,
      page: page.toString(),
    })));
    return shuffleArrayPage(wordsAll.flat());
  }

  async game(difficult: string) {
    this.arrWords = await GameAudio.getAllWords(difficult);
    this.createCard();
  }

  createCard(prev?: CardAudio) {
    if (prev) prev.destroy();
    const card = new CardAudio(this.node, this.value, this.arrWords);
    document.onkeydown = (e) => this.listenKey(card, e.key);
    card.allWords.forEach((item) => {
      item.node.addEventListener('click', () => this.listenGame(item, card));
    });
  }

  listenKey(card: CardAudio, key: string) {
    const success = new Audio('../../assets/sound/ok.mp3');
    const fail = new Audio('../../assets/sound/fail.mp3');
    const successWord = card.allWords.find((el) => el.word.id === card.successWord.id);

    if (card.allWords.map((i) => i.value).includes(+key)) {
      const thisCard = card.allWords.find((el) => el.value === +key);

      if (successWord?.value === +key) {
        this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
        successWord.node.classList.add('success');
        this.arrWordsStatus.push({ word: successWord.word, status: 'success' });
        success.play();
      } else if (thisCard) {
        successWord?.node.classList.toggle('success');
        this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
        thisCard.node.classList.add('failed');
        fail.play();
        this.arrWordsStatus.push({ word: thisCard.word, status: 'failed' });
      }

      card.allWords.forEach((node) => { node.node.disabled = true; });
      card.viewCard();
      if (this.value.word < 20) {
        this.buttonNext(card);
      } else {
        this.viewStatistic(card);
      }
    }
  }

  listenGame(item: ICardAudio, card: CardAudio) {
    const success = new Audio('../../assets/sound/ok.mp3');
    const fail = new Audio('../../assets/sound/fail.mp3');
    const successWord = card.allWords.find((el) => el.word.id === card.successWord.id);

    if (item.word.id === card.successWord.id) {
      this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
      item.node.classList.add('success');
      this.arrWordsStatus.push({ word: item.word, status: 'success' });
      success.play();
    } else {
      this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
      item.node.classList.add('failed');
      fail.play();
      this.arrWordsStatus.push({ word: item.word, status: 'failed' });
      successWord?.node.classList.toggle('success');
    }
    card.allWords.forEach((node) => { node.node.disabled = true; });
    card.viewCard();
    if (this.value.word < 20) {
      this.buttonNext(card);
    } else {
      this.viewStatistic(card);
    }
  }

  viewStatistic(prev?: CardAudio) {
    if (prev) prev.destroy();
    this.progress.destroy();
    const statistic = new StatisticAudio(this.node, this.arrWordsStatus);
    document.onkeydown = () => {};
  }

  buttonNext(card: CardAudio) {
    const button = new Control(null, 'button', 'button_next', 'NEXT');
    card.node.prepend(button.node);
    button.node.addEventListener('click', () => {
      this.arrWords.splice(card.index, 1);
      this.createCard(card);
      button.destroy();
    });
    document.onkeydown = (e) => {
      if (e.key === 'Enter') {
        this.arrWords.splice(card.index, 1);
        this.createCard(card);
        button.destroy();
      }
    };
  }

  render(node: HTMLElement) {
    node.append(this.node);
  }
}

export default GameAudio;
