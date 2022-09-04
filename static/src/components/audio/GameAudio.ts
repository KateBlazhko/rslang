import Words, { IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import randomSort from '../utils/functions';
import { shufflePage, shuffleArrayPage, seriesSuccess } from '../common/shufflePage';
import Logging, { IStateLog } from '../login/Logging';
import CardAudio from './CardAudio';
import StatisticAudio from './StatisticAudio';
import Stats from '../api/Stats';

interface ICardAudio {
    value: number;
    node: HTMLButtonElement;
    word: IWord;
}
class GameAudio extends Control {
  arrWords: IWord[];

  progress: Control<HTMLElement>;

  arrWordsStatus: Array<{word: IWord, status: boolean}>;

  repeat: Control<HTMLImageElement>;

  startPage: () => void;

  login: Logging;

  count: number;

  randomWords: IWord[];

  value: { word: number; progress: number; step: number; };

  constructor(start: () => void, login: Logging) {
    super(null, 'div', 'game__page__audio');
    this.login = login;
    this.repeat = new Control<HTMLImageElement>(this.node, 'img', 'arrow_img', '');
    this.startPage = start;
    this.progress = new Control(this.node, 'div', 'audio_call__progress', 'Your Progress');
    this.repeat.node.src = '../../assets/icons/arrow.png';
    this.arrWords = [];
    this.randomWords = [];
    this.arrWordsStatus = [];
    this.value = { word: 0, progress: 0, step: 0 };
    this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.progress}%, gainsboro ${0}%, gainsboro)`;
    this.count = 20;
    this.repeatListen();
  }

  repeatListen() {
    this.repeat.node.addEventListener('click', () => {
      document.onkeydown = () => {};
      this.startPage();
    });
  }

  static async getAllWords(difficult: string, page?: string) {
    if (page) {
      const words = await Words.getWords({
        group: difficult,
        page,
      });

      const wordsAll = await Words.checkWords(words, +difficult, +page);

      return shuffleArrayPage(wordsAll);
    }
    const wordsAll = await Promise.all(shufflePage().map((pageNumber) => Words.getWords({
      group: difficult,
      page: pageNumber.toString(),
    })));

    return shuffleArrayPage(wordsAll.flat());
  }

  // eslint-disable-next-line class-methods-use-this
  async getDifficultWord(user: IStateLog) {
    // const words: IWord[] = [];
    const res = Words.adapterAggregatedWords(await Words.getDifficultyWords(user));

    return res;
  }

  async game(difficult: string, prevPage: string) {
    this.randomWords = await GameAudio.getAllWords('5');
    const stateLog = await this.login.checkStorageLogin();
    if (!prevPage.includes('book')) {
      this.arrWords = await GameAudio.getAllWords(difficult);
      this.count = this.arrWords.length / 5;
      this.value.step = 100 / this.count;
    } else if (prevPage.split('/').length === 2 && prevPage.includes('difficult')) {
      this.arrWords = await this.getDifficultWord(stateLog);
      this.count = this.arrWords.length;
      this.value.step = 100 / this.count;
    } else {
      const el = prevPage.split('/');
      const group = el[1];
      const page = el[2];
      if (stateLog.state) {
        this.arrWords = await GameAudio.getAggregatedWords(stateLog, +group, +page);
        this.count = this.arrWords.length;
        this.value.step = 100 / this.count;
      } else {
        this.arrWords = await GameAudio.getAllWords(group, `${page}`);
        this.count = this.arrWords.length;
        this.value.step = 100 / this.count;
      }
    }

    this.createCard();
  }

  // static async pageWords(difficult: string, page: string) {
  //   let thisPage = +page;
  //   const words = [];
  //   words.push(...await GameAudio.getAllWords(difficult, `${thisPage}`));
  //   if (words.length < 19) {
  //     thisPage = thisPage > 0 ? thisPage - 1 : thisPage = 29;
  //     words.push(...await GameAudio.getAllWords(difficult, `${thisPage}`));
  //   }
  //   return words;
  // }

  // static async getAggWords(stateLog: IStateLog, group: number, page: number) {
  //   let thisPage = page;
  //   const words = [];
  //   words.push(...await GameAudio.getAggregatedWords(stateLog, +group, thisPage));
  //   if (words.length < 19) {
  //     thisPage = thisPage > 0 ? thisPage - 1 : thisPage = 29;
  //     words.push(...await GameAudio.getAggregatedWords(stateLog, +group, thisPage));
  //   }
  //   return words;
  // }

  private static async getAggregatedWords(stateLog: IStateLog, group: number, page: number) {
    const aggregatedWords = await Words.getNoLearnWords(stateLog, group);
    const aggregatedWordsFull = await Words.checkAggregatedWords(
      aggregatedWords,
      group,
      page,
      stateLog,
    );

    return shuffleArrayPage(aggregatedWordsFull);
  }

  createCard(prev?: CardAudio) {
    if (prev) prev.destroy();
    const card = new CardAudio(
      this.node,
      this.value,
      this.arrWords,
      this.arrWordsStatus,
      this.randomWords,
    );

    document.onkeydown = (e) => this.listenKey(card, e.key);
    card.resultWords.forEach((item) => {
      item.node.addEventListener('click', () => this.listenGame(item, card));
    });
  }

  listenKey(card: CardAudio, key: string) {
    const success = new Audio('../../assets/sound/ok.mp3');
    const fail = new Audio('../../assets/sound/fail.mp3');
    const successWord = card.resultWords.find((el) => el.word.id === card.words.successWord.id);

    if (card.resultWords.map((i) => i.value).includes(+key)) {
      const thisCard = card.resultWords.find((el) => el.value === +key);

      if (successWord?.value === +key) {
        this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.progress}%, gainsboro ${this.value.progress += this.value.step}%, gainsboro)`;
        successWord.node.classList.add('success');
        this.arrWordsStatus.push({ word: card.words.successWord, status: true });
        success.play();
      } else if (thisCard) {
        successWord?.node.classList.toggle('success');
        this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.progress}%, gainsboro ${this.value.progress += this.value.step}%, gainsboro)`;
        thisCard.node.classList.add('failed');
        fail.play();
        this.arrWordsStatus.push({ word: card.words.successWord, status: false });
      }

      card.resultWords.forEach((node) => { node.node.disabled = true; });
      card.viewCard();
      this.buttonNext(card);
    }
  }

  listenGame(item: ICardAudio, card: CardAudio) {
    const success = new Audio('../../assets/sound/ok.mp3');
    const fail = new Audio('../../assets/sound/fail.mp3');
    const successWord = card.resultWords.find((el) => el.word.id === card.words.successWord.id);

    if (item.word.id === card.words.successWord.id) {
      this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
      item.node.classList.add('success');
      this.arrWordsStatus.push({ word: card.words.successWord, status: true });
      success.play();
    } else {
      this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
      item.node.classList.add('failed');
      this.arrWordsStatus.push({ word: card.words.successWord, status: false });
      fail.play();
      successWord?.node.classList.toggle('success');
    }
    card.resultWords.forEach((node) => { node.node.disabled = true; });
    card.viewCard();
    this.buttonNext(card);
  }

  async saveWordsUser() {
    const stateLog = await this.login.checkStorageLogin();
    if (stateLog.state) {
      const userWordsAll = await Words.getUserWords(stateLog.userId, stateLog.token);

      await Promise.all(this.arrWordsStatus.map((word) => {
        const userWord = userWordsAll.find((item) => item.optional.wordId === word.word.id);
        if (userWord) {
          return Words.updateWordStat(stateLog, userWord, word.status);
        }
        return Words.createWordStat(stateLog, { wordId: word.word.id, answer: word.status });
      }));

      const gameStat = this.gameStatistic(this.arrWordsStatus, userWordsAll);
      const recordGameResult = await Stats.recordGameStats(stateLog, gameStat, 'audio');
    }
  }

  viewStatistic(prev?: CardAudio) {
    if (prev) prev.destroy();
    this.saveWordsUser();
    this.progress.destroy();
    const statistic = new StatisticAudio(this.node, this.arrWordsStatus);
    document.onkeydown = () => {};
  }

  gameStatistic(arrWord: { word: IWord, status: boolean }[], userWords: IUserWord[]) {
    const map = userWords.map((el) => el.optional.wordId);
    const res = arrWord.filter((el) => !map.includes(el.word.id));
    return {
      newWords: res.length,
      сountRightAnswer: arrWord.filter((el) => el.status === true).length,
      countError: arrWord.filter((el) => el.status === false).length,
      maxSeriesRightAnswer: seriesSuccess(this.arrWordsStatus),
    };
  }

  buttonNext(card: CardAudio) {
    const button = new Control(null, 'button', 'button_next', 'Next');
    card.node.prepend(button.node);
    button.node.addEventListener('click', () => {
      if (this.value.word < this.count) {
        this.createCard(card);
      } else {
        this.viewStatistic(card);
      }
      button.destroy();
    });
    document.onkeydown = (e) => {
      if (e.key === 'Enter') {
        if (this.value.word < this.count) {
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
