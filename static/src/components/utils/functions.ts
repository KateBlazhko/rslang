import { IWord } from '../api/Words';

function randomSort(array: IWord[] | number[]) {
  let currentIndex: number = +array.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function adapterDate (date: Date) {
  const year = new Date(Date.parse(date.toString())).getFullYear()
  const month = new Date(Date.parse(date.toString())).getMonth()
  const day = new Date(Date.parse(date.toString())).getDate()

  return `${year}-${month + 1}-${day}`
}

export function getPercent(value: number, sum: number) {
  return (value * 100) / sum
}

export default randomSort;
