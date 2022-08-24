import { IWord } from "../api/Words";

export function randomSort(array: IWord[]) {
  let currentIndex: number = +array.length;
  let randomIndex: number;

  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}