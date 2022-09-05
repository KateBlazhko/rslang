import BASELINK from '../constants/url';
import ErrorUser from '../utils/ErrorUser';

interface ICreateUser {
  name: string,
  email: string,
  password: string
}

interface ILoginUser {
  email: string,
  password: string
}

interface IAuth {
  message: string
  token: string
  refreshToken: string
  userId: string
  name: string
}

interface IToken {
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string
}
class User {
  static createUser = async (user: ICreateUser) => {
    const rawResponse = await fetch(`${BASELINK}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    try {
      return rawResponse;
    } catch (e) {
      return new ErrorUser(rawResponse);
    }
  };

  static loginUser = async (user: ILoginUser) => {
    const rawResponse = await fetch(`${BASELINK}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    try {
      return rawResponse;
    } catch (e) {
      return new ErrorUser(rawResponse);
    }
  };

  static getUser = async (userId: string, token: string) => {
    const rawResponse = await fetch(`${BASELINK}/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    try {
      return rawResponse;
    } catch (e) {
      return new ErrorUser(rawResponse);
    }
  };

  static getToken = async (userId: string, token: string) => {
    const rawResponse = await fetch(`${BASELINK}/users/${userId}/tokens`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    try {
      return rawResponse;
    } catch (e) {
      return new ErrorUser(rawResponse);
    }
  };
}

export { User, IAuth, IToken };
