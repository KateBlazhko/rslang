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
  let currentIndex: number = +array.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

const shuffleWord = (word: number, countWord = 100) => {
  const arrWord: Array<number> = [];
  arrWord.push(word);
  while (arrWord.length < 6) {
    const value = Math.floor(Math.random() * countWord);
    if (!arrWord.find((i) => i === value)) arrWord.push(value);
  }
  let currentIndex: number = arrWord.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    [arrWord[currentIndex], arrWord[randomIndex]] = [
      arrWord[randomIndex], arrWord[currentIndex]];
  }
  return arrWord;
};

export { shufflePage, shuffleArrayPage, shuffleWord };
