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

export {
  createUser, loginUser, ICreateUser, ILoginUser,
};
