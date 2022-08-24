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
};

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
};

class Words {

  public static getQueryParams(gueryParams: Record<string, string | number>): string {
    let search = ''
      Object.keys(gueryParams).forEach((key) => {
        if (gueryParams[key]) { search += `${key}=${gueryParams[key]}&`; }
      });

    return search.slice(0, -1);
  };
  
  public static async getWords (gueryParams: Record<string, string | number>) {
      const url = `${BASELINK}/words?${Words.getQueryParams(gueryParams)}`;

      const rawResponse = await fetch(url);
      const content: IWord[] = await rawResponse.json();
      return content;
  };

  public static async getWordByID (wordId: string) {
    const url = `${BASELINK}/words/${wordId}`;

    const rawResponse = await fetch(url);
    const content: IWord = await rawResponse.json();
    return content;
  };

  public static async getUserWords (userId: string, token: string) {
    const url = `${BASELINK}/users/${userId}/words`;
    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    });
    const content: IUserWord[] = await rawResponse.json();

    return content;
  };

  public static async getUserWordByID (userId: string, token: string, wordID: string) {
    const url = `${BASELINK}/users/${userId}/words/${wordID}`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    });
    const content: IUserWord = await rawResponse.json();
    return content;
  };

  public static async createUserWord (userId: string, token: string, wordId: string, word: IUserWord) {
    const url = `${BASELINK}/users/${userId}/words/${wordId}`;
    console.log(JSON.stringify(word))
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
  };

  public static async updateUserWord (userId: string, token: string, wordID: string, word: IUserWord) {
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
  };
}

export default Words;


