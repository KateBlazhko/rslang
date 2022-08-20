const localLink = 'http://localhost:3000';
const BASELINK = 'https://rs-lang-machine.herokuapp.com';

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

const createUser = async (user: ICreateUser) => {
  const rawResponse = await fetch(`${localLink}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  try {
    // const content = await rawResponse.json();
    return rawResponse;
  } catch (e) {
    return rawResponse;
  }
};

const loginUser = async (user: ILoginUser) => {
  const rawResponse = await fetch(`${localLink}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  try {
    // const content = await rawResponse.json();
    return rawResponse;
  } catch (e) {
    return rawResponse;
  }
};

const getUser = async (userId: string, token: string) => {
  const rawResponse = await fetch(`${localLink}/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  try {
    return rawResponse;
  } catch (e) {
    return rawResponse;
  }
};

export {
  createUser, loginUser, ICreateUser, ILoginUser, getUser, IAuth,
};
