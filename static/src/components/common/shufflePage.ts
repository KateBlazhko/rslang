import { IWord } from '../api/Words';

const shufflePage = (countPage = 30) => {
  const page: Array<number> = [];
  while (page.length < 5) {
    const value = Math.round(Math.random() * countPage);
    if (!page.find((item) => item === value)) page.push(value);
  }
  return page;
};

const shuffleArrayPage = (array: Array<IWord>) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export { shufflePage, shuffleArrayPage };
