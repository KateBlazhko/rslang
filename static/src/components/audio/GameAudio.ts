import Words, { IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import { shufflePage, shuffleArrayPage } from '../common/shufflePage';
import Logging from '../Logging';
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

  arrWordsStatus: Array<{word: IWord, status: boolean}>;

  repeat: Control<HTMLImageElement>;

  startPage: () => void;

  login: Logging;

  constructor(start: () => void, login: Logging) {
    super(null, 'div', 'game__page__audio');
    this.login = login;
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
        this.arrWordsStatus.push({ word: successWord.word, status: true });
        success.play();
      } else if (thisCard) {
        successWord?.node.classList.toggle('success');
        this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
        thisCard.node.classList.add('failed');
        fail.play();
        this.arrWordsStatus.push({ word: thisCard.word, status: false });
      }

      card.allWords.forEach((node) => { node.node.disabled = true; });
      card.viewCard();
      this.buttonNext(card);
    }
  }

  listenGame(item: ICardAudio, card: CardAudio) {
    const success = new Audio('../../assets/sound/ok.mp3');
    const fail = new Audio('../../assets/sound/fail.mp3');
    const successWord = card.allWords.find((el) => el.word.id === card.successWord.id);

    if (item.word.id === card.successWord.id) {
      this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
      item.node.classList.add('success');
      this.arrWordsStatus.push({ word: item.word, status: true });
      success.play();
    } else {
      this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
      item.node.classList.add('failed');
      fail.play();
      this.arrWordsStatus.push({ word: item.word, status: false });
      successWord?.node.classList.toggle('success');
    }
    card.allWords.forEach((node) => { node.node.disabled = true; });
    card.viewCard();
    this.buttonNext(card);
  }

  async saveWordsUser() {
    const user = await this.login.checkStorageLogin();
    const userWords = await Words.getUserWords(user.userId, user.token);

    const successArr: Array<{wordRes: IUserWord, wordThis: { word: IWord; status: boolean; }}> = [];
    const failedArr: { word: IWord; status: boolean; }[] = [];

    this.arrWordsStatus.forEach((item) => {
      const word = userWords.find((el) => el.optional.wordId === item.word.id);
      if (word) {
        successArr.push({ wordRes: word, wordThis: item });
      } else {
        failedArr.push(item);
      }
    });

    if (successArr.length > 0) {
      Promise.all(successArr.map((req) => (
        Words.updateUserStat(user, req.wordRes, req.wordThis.status)
      )));
    }
    if (successArr.length > 0) {
      Promise.all(failedArr.map((req) => (
        Words.createUserStat(user, { wordId: req.word.id, answer: req.status })
      )));
    }
  }

  viewStatistic(prev?: CardAudio) {
    if (prev) prev.destroy();
    this.saveWordsUser();
    this.progress.destroy();
    const statistic = new StatisticAudio(this.node, this.arrWordsStatus);
    document.onkeydown = () => {};
  }

  buttonNext(card: CardAudio) {
    const button = new Control(null, 'button', 'button_next', 'NEXT');
    card.node.prepend(button.node);
    button.node.addEventListener('click', () => {
      this.arrWords.splice(card.index, 1);
      if (this.value.word < 20) {
        this.createCard(card);
      } else {
        this.viewStatistic(card);
      }
      button.destroy();
    });
    document.onkeydown = (e) => {
      if (e.key === 'Enter') {
        this.arrWords.splice(card.index, 1);
        if (this.value.word < 20) {
          this.createCard(card);
        } else {
          this.viewStatistic(card);
        }
        button.destroy();
      }
    };
  }

  render(node: HTMLElement) {
    node.append(this.node);
  }
}

export default GameAudio;
