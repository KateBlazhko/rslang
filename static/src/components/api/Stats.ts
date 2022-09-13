import BASELINK from '../constants/url';
import { IStateLog } from '../login/Logging';
import ErrorUser from '../utils/ErrorUser';
import { adapterDate } from '../utils/functions';
import Words from './Words';

export interface IGameStat {
  newWords: number,
  сountRightAnswer: number,
  countError: number,
  maxSeriesRightAnswer: number,
  dateLast: string,
}

export type GeneralItem = Record<string, number>
export interface IGeneral {
  newWords: GeneralItem,
  learnedWords: GeneralItem
}

export interface IStatOptional {
  dateReg: string,
  sprint: IGameStat,
  audio: IGameStat,
  general: IGeneral
}

export interface IStat {
  learnedWords: number,
  optional: IStatOptional
}

class Stats {
  public static async getStats(userId: string, token: string) {
    const url = `${BASELINK}/users/${userId}/statistics`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const content: IStat = await rawResponse.json();
    return content;
  }

  public static async updateStat(
    userId: string,
    token: string,
    stat: IStat,
  ) {
    const url = `${BASELINK}/users/${userId}/statistics`;

    const rawResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stat),
    });
    try {
      return rawResponse;
    } catch (e) {
      return new ErrorUser(rawResponse);
    }
  }

  public static async recordGameStats(stateLog: IStateLog, gameStatNew: IGameStat, game: 'sprint' | 'audio') {
    const userStat = await Stats.getStats(stateLog.userId, stateLog.token);
    const gameStat = userStat.optional[game]
    const dataCurrentAdapt = adapterDate(new Date());

    const isSameDate = gameStat.dateLast === dataCurrentAdapt;
    // const learnedWords = await Words.getLearnedWordsByDate(stateLog, dataCurrentAdapt);

    // const countLearnedWords = learnedWords.length;

    if (isSameDate) {
      Stats.addToStat(stateLog, userStat, gameStatNew, game);
    } else {
      Stats.recordStat(stateLog, userStat, gameStatNew, game, dataCurrentAdapt);
    }
  }

  public static async recordGeneralStats(
    stateLog: IStateLog,
    newWordsStats: GeneralItem,
    learnedWordsStats: GeneralItem,
  ) {
    const userStat = await Stats.getStats(stateLog.userId, stateLog.token);

    const {
      learnedWords, optional: {
        dateReg, sprint, audio, general,
      },
    } = userStat;

    const newGeneral = {
      newWords: {
        ...general.newWords,
        ...newWordsStats,
      },
      learnedWords: {
        ...general.learnedWords,
        ...learnedWordsStats,
      },
    };

    Stats.updateStat(stateLog.userId, stateLog.token, {
      learnedWords,
      optional: {
        dateReg,
        sprint,
        audio,
        general: newGeneral,
      },
    });
  }

  public static async addToStat(
    stateLog: IStateLog,
    userStat: IStat,
    gameStat: IGameStat,
    game: 'sprint' | 'audio',
  ) {
    const {
      optional: {
        [game]: {
          newWords: newWordsLast,
          сountRightAnswer: сountRightAnswerLast,
          countError: countErrorLast,
          maxSeriesRightAnswer: maxSeriesRightAnswerLast,
        },
      },
    } = userStat;

    const {
      newWords, сountRightAnswer, countError, maxSeriesRightAnswer,
    } = gameStat;

    const recordStat = await Stats.updateStat(stateLog.userId, stateLog.token, {
      learnedWords: userStat.learnedWords,
      optional: {
        ...userStat.optional,
        [game]: {
          newWords: newWordsLast + newWords,
          сountRightAnswer: сountRightAnswerLast + сountRightAnswer,
          countError: countErrorLast + countError,
          maxSeriesRightAnswer: Math.max(maxSeriesRightAnswerLast, maxSeriesRightAnswer),
          dateLast: adapterDate(new Date())
        },
      },
    });
  }

  public static async recordStat(
    stateLog: IStateLog,
    userStat: IStat,
    gameStat: IGameStat,
    game: 'sprint' | 'audio',
    dateCurrent: string,
  ) {
    const {
      newWords, сountRightAnswer, countError, maxSeriesRightAnswer,
    } = gameStat;

    const recordStat = await Stats.updateStat(stateLog.userId, stateLog.token, {
      learnedWords: userStat.learnedWords,
      optional: {
        ...userStat.optional,
        [game]: {
          newWords,
          сountRightAnswer,
          countError,
          maxSeriesRightAnswer,
          dateLast: dateCurrent,

        },
      },
    });
  }

  public static async resetStat(
    stateLog: IStateLog,
    userStat: IStat,
    dateCurrent: string,
    game: string
  ) {
    const { optional: { dateReg, general } } = userStat;

    const recordStat = await Stats.updateStat(stateLog.userId, stateLog.token, {
      learnedWords: userStat.learnedWords,
      optional: {
        ...userStat.optional,
        [game]: {
          newWords: 0,
          сountRightAnswer: 0,
          countError: 0,
          maxSeriesRightAnswer: 0,
          dateLast: dateCurrent,

        },
      },
    });
  }
}

export default Stats;
