import { Word } from "../api/dbWords";

export function randomSort(array: Word[]) {
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