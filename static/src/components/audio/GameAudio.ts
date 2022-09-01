import Words, { IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import randomSort from '../common/functions';
import { shufflePage, shuffleArrayPage, seriesSuccess } from '../common/shufflePage';
import Logging, { IStateLog } from '../Logging';
import CardAudio from './CardAudio';
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

  async game(difficult: string, prevPage: string) {
    if (!prevPage.includes('book')) {
      this.arrWords = await GameAudio.getAllWords(difficult);
    } else {
      const el = prevPage.split('/');
      const group = el[1];
      const page = el[2];
      const stateLog = await this.login.checkStorageLogin();
      if (stateLog.state) {
        this.arrWords = await GameAudio.getAggWords(stateLog, +group, +page);
      } else {
        this.arrWords = await GameAudio.pageWords(group.toString(), page.toString());
      }
    }

    this.createCard();
  }

  static async pageWords(difficult: string, page: string) {
    let thisPage = +page;
    const words = [];
    words.push(...await GameAudio.getAllWords(difficult, `${thisPage}`));
    if (words.length < 27) {
      thisPage = thisPage > 0 ? thisPage - 1 : thisPage = 29;
      words.push(...await GameAudio.getAllWords(difficult, `${thisPage}`));
    }
    return words;
  }

  static async getAggWords(stateLog: IStateLog, group: number, page: number) {
    let thisPage = page;
    const words = [];
    words.push(...await GameAudio.getAggregatedWords(stateLog, +group, thisPage));
    if (words.length < 27) {
      thisPage = thisPage > 0 ? thisPage - 1 : thisPage = 29;
      words.push(...await GameAudio.getAggregatedWords(stateLog, +group, thisPage));
    }
    return words;
  }

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
    const card = new CardAudio(this.node, this.value, this.arrWords, this.arrWordsStatus);

    document.onkeydown = (e) => this.listenKey(card, e.key);
    card.allWords.forEach((item) => {
      item.node.addEventListener('click', () => this.listenGame(item, card));
    });
  }

  listenKey(card: CardAudio, key: string) {
    const success = new Audio('../../assets/sound/ok.mp3');
    const fail = new Audio('../../assets/sound/fail.mp3');
    const successWord = card.allWords.find((el) => el.word.id === card.words.successWord.id);

    if (card.allWords.map((i) => i.value).includes(+key)) {
      const thisCard = card.allWords.find((el) => el.value === +key);

      if (successWord?.value === +key) {
        this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
        successWord.node.classList.add('success');
        this.arrWordsStatus.push({ word: card.words.successWord, status: true });
        success.play();
      } else if (thisCard) {
        successWord?.node.classList.toggle('success');
        this.progress.node.style.background = `linear-gradient(to right, rgb(5, 176, 255) ${this.value.word * 5}%, gainsboro ${this.value.word * 5 + 2}%, gainsboro)`;
        thisCard.node.classList.add('failed');
        fail.play();
        this.arrWordsStatus.push({ word: card.words.successWord, status: false });
      }

      card.allWords.forEach((node) => { node.node.disabled = true; });
      card.viewCard();
      this.buttonNext(card);
    }
  }

  listenGame(item: ICardAudio, card: CardAudio) {
    const success = new Audio('../../assets/sound/ok.mp3');
    const fail = new Audio('../../assets/sound/fail.mp3');
    const successWord = card.allWords.find((el) => el.word.id === card.words.successWord.id);

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
    card.allWords.forEach((node) => { node.node.disabled = true; });
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
          return Words.updateUserStat(stateLog, userWord, word.status);
        }
        return Words.createUserStat(stateLog, { wordId: word.word.id, answer: word.status });
      }));

      console.log(this.gameStatistic(this.arrWordsStatus, userWordsAll));
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
    const res = arrWord.filter((el) => map.includes(el.word.id));
    return {
      newWords: res,
      сountRightAnswer: arrWord.filter((el) => el.status === true),
      countError: arrWord.filter((el) => el.status === false),
      maxSeriesRightAnswer: seriesSuccess(this.arrWordsStatus),
    };
  }

  // IGameStat {
  //   newWords: number, (тех, которых не было в пользовательских)
  //   сountRightAnswer: number, (количество правильных ответов за игру)
  //   countError: number, (количество ошибок за игру)
  //   maxSeriesRightAnswer: number (максимальная серия правильных ответов за игру)
  // }

  buttonNext(card: CardAudio) {
    const button = new Control(null, 'button', 'button_next', 'Next');
    card.node.prepend(button.node);
    button.node.addEventListener('click', () => {
      if (this.value.word < 20) {
        this.createCard(card);
      } else {
        this.viewStatistic(card);
      }
      button.destroy();
    });
    document.onkeydown = (e) => {
      if (e.key === 'Enter') {
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
