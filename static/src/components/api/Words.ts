import { IStateLog } from '../Logging';
import { IWordStat } from '../sprint/sprint';
import ErrorUser from '../utils/ErrorUser';

export const BASELINK = 'http://localhost:3000';
// export const BASELINK = 'https://rs-lang-machine.herokuapp.com';

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

export interface IUserWord {
    difficulty: 'easy' | 'hard',
    optional: {
      wordId: string
      сountRightAnswer: number
      countError: number
      seriesRightAnswer: number
      isLearn: boolean
      dataGetNew: Date
      dataLearn?: Date | undefined
    }
}

export interface IAggregatedWords {
  paginatedResults: IWord[]
  totalCount: {
    count: number
  }[]
}

export interface IQueryParams {
  group: string,
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

  public static async updateUserStat(stateLog: IStateLog, userWord: IUserWord, answer: boolean) {
    if (answer) {
      const isLearn = Words.checkIsLearn(userWord);
      const date = new Date();
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
            dataLearn: (isLearn && isLearn !== userWord.optional.isLearn) ? date : undefined,
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

  public static async createUserStat(stateLog: IStateLog, word: IWordStat) {
    const date = new Date();

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

  public static async checkAggregatedWords(
    aggregatedWords: IAggregatedWords[] | ErrorUser,
    group: number,
    page: number,
    stateLog: IStateLog,
  ) {
    if (Array.isArray(aggregatedWords)) {
      const aggregatedWordsAll = aggregatedWords
        .map((aggregatedWord) => aggregatedWord.paginatedResults
          .filter((res) => res.page === page))
        .flat();

      if (aggregatedWordsAll.length < 100 && page > 0) {
        const pageList = [...Array(page).keys()];
        const pageIndex = pageList.length - 1;

        aggregatedWordsAll.push(...await Words.addWordsFromOtherPages(
          aggregatedWordsAll.length,
          pageList,
          pageIndex,
          group,
          stateLog,
        ));
      }

      return aggregatedWordsAll;
    }

    throw ErrorUser;
  }

  private static async addWordsFromOtherPages(
    currentCount: number,
    pageList: number[],
    pageIndex: number,
    group: number,
    stateLog: IStateLog,
  ) {
    let count = currentCount;
    const words: IWord[] = [];

    if (count >= 100 || pageIndex < 0) {
      return words;
    }

    const aggregatedWordsAdd = await Words.getNoLearnWords(stateLog, group);

    if (Array.isArray(aggregatedWordsAdd)) {
      const aggregatedWordsAddAll = aggregatedWordsAdd
        .map((aggregatedWordAdd) => aggregatedWordAdd.paginatedResults
          .filter((res) => res.page === pageList[pageIndex]))
        .flat();

      words.push(...aggregatedWordsAddAll);
      count += aggregatedWordsAddAll.length;

      words.push(...await Words.addWordsFromOtherPages(
        count,
        pageList,
        pageIndex - 1,
        group,
        stateLog,
      ));
    }

    return words;
  }
}

export default Words;
