// const BASELINK = 'https://rs-lang-machine.herokuapp.com'
const BASELINK = 'http://localhost:3000'

export type Word = Record<string, string>

export type RespObject = {
  endpoint: string;
  gueryParams: Record<string, string | number>;
};

export const getWords= async (options: RespObject) => {
  const rawResponse = await fetch(makeUrl(BASELINK, options))
  const content: Word[] = await rawResponse.json();
  return content
};

const makeUrl = (baseLink: string, options: RespObject): string => {
  const { endpoint, gueryParams } = options;

  let url = `${baseLink}${endpoint}?`;

  Object.keys(gueryParams).forEach((key) => {
    if (gueryParams[key]) { url += `${key}=${gueryParams[key]}&`; }
  });

  return url.slice(0, -1);
}