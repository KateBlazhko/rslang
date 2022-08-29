import { IStateLog } from '../login/Logging';
import { IGameStat, IWordStat } from '../sprint/sprint';
import ErrorUser from '../utils/ErrorUser';
import { adapterDate } from '../utils/functions';
import Words from './Words';

export const BASELINK = 'http://localhost:3000';
// export const BASELINK = 'https://rs-lang-machine.herokuapp.com';

export interface IStat {
  learnedWords: number,
  optional: {
    dateReg: Date,
    dateCurrent: Date,
    sprint: IGameStat,
    audio: IGameStat,
    words: {
      newWords: number,
      сountRightAnswer: number,
      countError: number,
      learnedWords: number
    }
  }
}


class Stats {
  
  public static async getStats(userId: string, token: string,) {
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
    stat: IStat
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

  public static async recordGameStats(stateLog: IStateLog, gameStat: IGameStat, game: 'sprint' | 'audio') {
    const userStat = await Stats.getStats(stateLog.userId, stateLog.token)
    const dateCurrent = new Date
    const dataAdapt = adapterDate(new Date)

    const isSameDate = Stats.checkDate(userStat.optional.dateCurrent, dateCurrent)
    const learnedWords = await Words.getLearnedWords(stateLog, dataAdapt)
    if (Array.isArray(learnedWords)) {
      const countLearnedWords = learnedWords
        .map((learnedWord) => learnedWord.paginatedResults)
        .flat()
        .length

      if (isSameDate) {
        Stats.addToStat(stateLog, userStat, gameStat, countLearnedWords, game)
      } else {
        Stats.resetStat(stateLog, userStat, gameStat, countLearnedWords, game, dateCurrent)
      }
    }

    
    
  }

  public static checkDate(dateCurrentLast: Date, dateCurrent: Date) {
    const lastYear = new Date(Date.parse(dateCurrentLast.toString())).getFullYear()
    const lastMonth = new Date(Date.parse(dateCurrentLast.toString())).getMonth()
    const lastDay = new Date(Date.parse(dateCurrentLast.toString())).getDate()

    if (dateCurrent.getFullYear() !== lastYear) return false
    if (dateCurrent.getMonth() !== lastMonth) return false
    if (dateCurrent.getDate() !== lastDay) return false

    return true
  }

  public static async addToStat(
    stateLog: IStateLog, 
    userStat: IStat, 
    gameStat: IGameStat,
    countLearnedWords: number, 
    game: 'sprint' | 'audio'
  ) {

    const { 
      optional: { 
        [game]: { 
          newWords: newWordsLast, 
          сountRightAnswer: сountRightAnswerLast, 
          countError: countErrorLast, 
          maxSeriesRightAnswer:  maxSeriesRightAnswerLast
        },
        words: {
          newWords: newWordsLastAll, 
          сountRightAnswer: сountRightAnswerLastAll, 
          countError: countErrorLastAll, 
        }
      } 
    } = userStat;

    const { newWords, сountRightAnswer, countError, maxSeriesRightAnswer } = gameStat

    const recordStat = await Stats.updateStat(stateLog.userId, stateLog.token, {
      learnedWords: userStat.learnedWords,
      optional: {
        ...userStat.optional,
        [game]: {
          newWords: newWordsLast + newWords,
          сountRightAnswer: сountRightAnswerLast + сountRightAnswer,
          countError: countErrorLast + countError,
          maxSeriesRightAnswer: Math.max(maxSeriesRightAnswerLast, maxSeriesRightAnswer)
        },
        words: {
          newWords: newWordsLastAll + newWords, 
          сountRightAnswer: сountRightAnswerLastAll + сountRightAnswer, 
          countError: countErrorLastAll + countError, 
          learnedWords:  countLearnedWords
        }
      }
    })
  }

  public static async resetStat(
    stateLog: IStateLog, 
    userStat: IStat, 
    gameStat: IGameStat, 
    countLearnedWords: number,
    game: 'sprint' | 'audio',
    dateCurrent: Date
  ) {
    const { newWords, сountRightAnswer, countError, maxSeriesRightAnswer } = gameStat
  
    const recordStat = await Stats.updateStat(stateLog.userId, stateLog.token, {
      learnedWords: userStat.learnedWords,
      optional: {
        ...userStat.optional,
        dateCurrent,
        [game]: {
          newWords: newWords,
          сountRightAnswer: сountRightAnswer,
          countError: countError,
          maxSeriesRightAnswer: maxSeriesRightAnswer
        },
        words: {
          newWords: newWords, 
          сountRightAnswer: сountRightAnswer, 
          countError: countError, 
          learnedWords:  countLearnedWords
        }
      }
    })
  }
}

export default Stats;
