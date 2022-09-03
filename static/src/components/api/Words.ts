import BASELINK from '../constants/url';
import { IStateLog } from '../login/Logging';
import { IWordStat } from '../sprint/sprint';
import ErrorUser from '../utils/ErrorUser';
import { adapterDate } from '../utils/functions';

export interface IWord {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string
}

export interface IWordAgr {
  _id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string
}

export interface IUserWord {
    difficulty: 'easy' | 'hard',
    optional: {
      wordId: string
      сountRightAnswer: number
      countError: number
      seriesRightAnswer: number
      isLearn: boolean
      dataGetNew: string | undefined
      dataLearn?: string | undefined
    }
}

export interface IAggregatedWords {
  paginatedResults: IWordAgr[]
  totalCount: {
    count: number
  }[]
}

export interface IQueryParams {
  group?: string,
  page?: string,
  wordsPerPage?: string,
  filter?: string
}

class Words {
  public static getQueryParams(gueryParams: IQueryParams): string {
    let search = '';
    Object.keys(gueryParams).forEach((key) => {
      if (key in gueryParams) {
        search += `${key}=${gueryParams[key as keyof IQueryParams]}&`;
      }
    });

    return search.slice(0, -1);
  }

  public static async getWords(gueryParams: IQueryParams) {
    const url = `${BASELINK}/words?${Words.getQueryParams(gueryParams)}`;

    const rawResponse = await fetch(url);
    const content: IWord[] = await rawResponse.json();
    return content;
  }

  public static async getWordByID(wordId: string) {
    const url = `${BASELINK}/words/${wordId}`;

    const rawResponse = await fetch(url);
    const content: IWord = await rawResponse.json();
    return content;
  }

  public static async getUserWords(userId: string, token: string) {
    const url = `${BASELINK}/users/${userId}/words`;
    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    const content: IUserWord[] = await rawResponse.json();

    return content;
  }

  public static async getUserWordByID(userId: string, token: string, wordID: string) {
    const url = `${BASELINK}/users/${userId}/words/${wordID}`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    const content: IUserWord = await rawResponse.json();
    return content;
  }

  public static async createUserWord(
    userId: string,
    token: string,
    wordId: string,
    word: IUserWord,
  ) {
    const url = `${BASELINK}/users/${userId}/words/${wordId}`;
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });

    try {
      return rawResponse;
    } catch (e) {
      return new ErrorUser(rawResponse);
    }
  }

  public static async updateUserWord(
    userId: string,
    token: string,
    wordID: string,
    word: IUserWord,
  ) {
    const url = `${BASELINK}/users/${userId}/words/${wordID}`;

    const rawResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    try {
      return rawResponse;
    } catch (e) {
      return new ErrorUser(rawResponse);
    }
  }

  public static async updateWordStat(stateLog: IStateLog, userWord: IUserWord, answer: boolean) {
    if (answer) {
      const isLearn = Words.checkIsLearn(userWord);
      const date = new Date();
      const dateAdapt = adapterDate(date);
      const result = await Words.updateUserWord(
        stateLog.userId,
        stateLog.token,
        userWord.optional.wordId,
        {
          difficulty: isLearn ? 'easy' : userWord.difficulty,
          optional: {
            wordId: userWord.optional.wordId,
            сountRightAnswer: userWord.optional.сountRightAnswer + 1,
            countError: userWord.optional.countError,
            seriesRightAnswer: userWord.optional.seriesRightAnswer + 1,
            isLearn,
            dataGetNew: userWord.optional.dataGetNew,
            dataLearn: (isLearn && isLearn !== userWord.optional.isLearn) ? dateAdapt : undefined,
          },
        },
      );
      return result;
    }
    const result = await Words.updateUserWord(
      stateLog.userId,
      stateLog.token,
      userWord.optional.wordId,
      {
        difficulty: userWord.difficulty,
        optional: {
          wordId: userWord.optional.wordId,
          сountRightAnswer: userWord.optional.сountRightAnswer,
          countError: userWord.optional.countError + 1,
          seriesRightAnswer: 0,
          isLearn: false,
          dataGetNew: userWord.optional.dataGetNew,
        },
      },
    );
    return result;
  }

  public static async createWordStat(stateLog: IStateLog, word: IWordStat) {
    const date = adapterDate(new Date());

    if (word.answer) {
      const result = await Words.createUserWord(stateLog.userId, stateLog.token, word.wordId, {
        difficulty: 'easy',
        optional: {
          wordId: word.wordId,
          сountRightAnswer: 1,
          countError: 0,
          seriesRightAnswer: 1,
          isLearn: false,
          dataGetNew: date,
        },
      });
      return result;
    }
    const result = await Words.createUserWord(stateLog.userId, stateLog.token, word.wordId, {
      difficulty: 'easy',
      optional: {
        wordId: word.wordId,
        сountRightAnswer: 0,
        countError: 1,
        seriesRightAnswer: 0,
        isLearn: false,
        dataGetNew: date,
      },
    });

    return result;
  }

  private static checkIsLearn(userWord: IUserWord) {
    if (userWord.difficulty === 'easy') {
      if (userWord.optional.seriesRightAnswer + 1 >= 3) {
        return true;
      }
    }

    if (userWord.difficulty === 'hard') {
      if (userWord.optional.seriesRightAnswer + 1 >= 5) {
        return true;
      }
    }

    return userWord.optional.isLearn;
  }

  private static async getAggregatedWords(
    userId: string,
    token: string,
    gueryParams: IQueryParams,
  ) {
    const url = `${BASELINK}/users/${userId}/aggregatedWords?${Words.getQueryParams(gueryParams)}`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const content: IAggregatedWords[] = await rawResponse.json();

    try {
      return content;
    } catch (e) {
      return new ErrorUser(rawResponse);
    }
  }

  public static async getNoLearnWords(stateLog: IStateLog, group: number) {
    const aggregatedWords = await Words.getAggregatedWords(
      stateLog.userId,
      stateLog.token,
      {
        group: group.toString(),
        page: '0',
        wordsPerPage: '600',
        filter: encodeURIComponent(JSON.stringify({ $or: [{ 'userWord.optional.isLearn': false }, { userWord: null }] })),
      },
    );

    return aggregatedWords;
  }

  public static async getLearnedWordsByDate(stateLog: IStateLog, date: string) {
    const aggregatedWords = await Words.getAggregatedWords(
      stateLog.userId,
      stateLog.token,
      {
        page: '0',
        wordsPerPage: '600',
        filter: encodeURIComponent(JSON.stringify({
          $and: [
            { 'userWord.optional.isLearn': true },
            { 'userWord.optional.dataLearn': date },
          ],
        })),
      },
    );

    if (Array.isArray(aggregatedWords)) {
      return aggregatedWords
        .map((words) => words.paginatedResults)
        .flat();
    }

    return [];
  }

  public static async getNewWordsByDate(stateLog: IStateLog, date: string) {
    const aggregatedWords = await Words.getAggregatedWords(
      stateLog.userId,
      stateLog.token,
      {
        page: '0',
        wordsPerPage: '600',
        filter: encodeURIComponent(JSON.stringify({
          'userWord.optional.dataGetNew': date,
        })),
      },
    );

    if (Array.isArray(aggregatedWords)) {
      return aggregatedWords
        .map((words) => words.paginatedResults)
        .flat();
    }

    return [];
  }

  public static async checkAggregatedWords(
    aggregatedWords: IAggregatedWords[] | ErrorUser,
    group: number,
    page: number,
    stateLog: IStateLog,
  ) {
    if (Array.isArray(aggregatedWords)) {
      const aggregatedWordsAll = aggregatedWords
        .map((aggregatedWord) => aggregatedWord.paginatedResults)
        .flat()
        .filter((res) => res.page === page);

      if (aggregatedWordsAll.length < 100 && page > 0) {
        const pageList = [...Array(page).keys()];
        const pageIndex = pageList.length - 1;

        aggregatedWordsAll.push(...await Words.addAggregatedWordsFromOtherPages(
          aggregatedWordsAll.length,
          pageList,
          pageIndex,
          group,
          stateLog,
        ));
      }

      return Words.adapterAggregatedWords(aggregatedWordsAll);
    }

    throw ErrorUser;
  }

  public static adapterAggregatedWords(aggregatedWordsAll: IWordAgr[]) {
    const wordsAll: IWord[] = aggregatedWordsAll.map((word) => {
      const { _id: id, ...wordRest } = word;
      return {
        id,
        ...wordRest,
      };
    });
    return wordsAll;
  }

  private static async addAggregatedWordsFromOtherPages(
    currentCount: number,
    pageList: number[],
    pageIndex: number,
    group: number,
    stateLog: IStateLog,
  ) {
    let count = currentCount;
    const words: IWordAgr[] = [];

    if (count >= 100 || pageIndex < 0) {
      return words;
    }

    const aggregatedWordsAdd = await Words.getNoLearnWords(stateLog, group);

    if (Array.isArray(aggregatedWordsAdd)) {
      const aggregatedWordsAddAll = aggregatedWordsAdd
        .map((aggregatedWord) => aggregatedWord.paginatedResults)
        .flat()
        .filter((res) => res.page === pageList[pageIndex]);

      words.push(...aggregatedWordsAddAll);
      count += aggregatedWordsAddAll.length;

      words.push(...await Words.addAggregatedWordsFromOtherPages(
        count,
        pageList,
        pageIndex - 1,
        group,
        stateLog,
      ));
    }

    return words;
  }

  public static async checkWords(
    words: IWord[],
    group: number,
    page: number,
  ) {
    if (words.length < 100 && page > 0) {
      const pageList = [...Array(page).keys()];
      const pageIndex = pageList.length - 1;

      words.push(...await Words.addWordsFromOtherPages(
        words.length,
        pageList,
        pageIndex,
        group,
      ));
    }

    return words;
  }

  public static async getDifficultyWords(stateLog: IStateLog) {
    const aggregatedWords = await Words.getAggregatedWords(
      stateLog.userId,
      stateLog.token,
      {
        page: '0',
        wordsPerPage: '600',
        filter: encodeURIComponent(JSON.stringify({
          'userWord.difficulty': 'hard',
        })),
        group: '',
      },
    );

    if (Array.isArray(aggregatedWords)) {
      return aggregatedWords
        .map((words) => words.paginatedResults)
        .flat();
    }

    return [];
  }

  public static async addWordsFromOtherPages(
    currentCount: number,
    pageList: number[],
    pageIndex: number,
    group: number,
  ) {
    let count = currentCount;
    const words: IWord[] = [];

    if (count >= 100 || pageIndex < 0) {
      return words;
    }

    const wordsAdd = await Words.getWords({
      group: group.toString(),
      page: pageList[pageIndex].toString(),
    });

    words.push(...wordsAdd);
    count += wordsAdd.length;

    words.push(...await Words.addWordsFromOtherPages(
      count,
      pageList,
      pageIndex - 1,
      group,
    ));

    return words;
  }
}

export default Words;
