import API_URL from "../../constants/api";
import { IWord } from "../api/Words";
import Control from "../common/control";
import stopPlayAudio from "../common/stopPlayAudio";

class CreateWordItem {
  constructor(word: IWord, bookItem: Control<HTMLElement>) {
    this.create(word, bookItem);
  }

  private create(word: IWord, bookItem: Control<HTMLElement>) {
    const imageElement = new Control(bookItem.node, "img", "book__item-image");
    const image = imageElement.node as HTMLImageElement;
    image.src = `${API_URL}/${word.image}`;
    image.alt = word.word;

    new Control(bookItem.node, "h1", "book__item-text", word.word);
    [
      word.transcription,
      word.wordTranslate,
      word.textMeaningTranslate,
      word.textExampleTranslate,
    ].forEach(
      (textElem) => new Control(bookItem.node, "p", "book__item-text", textElem)
    );

    bookItem.node.innerHTML += `
      <p class="book__item-text">${word.textExample}</p>
      <p class="book__item-text">${word.textMeaning}</p>
    `;
    const audioElement = new Control(bookItem.node, "img", "book__item-sound");

    audioElement.node.addEventListener("click", async () => {
      const audioItems = document.querySelectorAll(".book__item-sound");

      stopPlayAudio(audioItems, "none");

      const sounds = [
        `${API_URL}/${word.audio}`,
        `${API_URL}/${word.audioMeaning}`,
        `${API_URL}/${word.audioExample}`,
      ];

      const firstSound = new Audio(sounds[0]);
      const secondSound = new Audio(sounds[1]);
      const thirdSound = new Audio(sounds[2]);

      await firstSound.play();

      setTimeout(async () => {
        await secondSound.play();

        setTimeout(async () => {
          await thirdSound.play();

          setTimeout(() => {
            stopPlayAudio(audioItems, "auto");
          }, thirdSound.duration * 1000);
        }, (firstSound.duration + secondSound.duration) * 1000);
      }, firstSound.duration * 1000);
    });
  }
}

export default CreateWordItem;
