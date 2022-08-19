const localLink = 'http://localhost:3000';

interface ICreateUser {
  name: string,
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
  const content = await rawResponse.json();

  console.log(content);
};

export default createUser;
