import API_URL from "../../constants/api";
import { IWord } from "../api/Words";
import Control from "../common/control";
import stopPlayAudio from "../common/stopPlayAudio";

const createWordItem = (word: IWord, bookItem: Control<HTMLElement>) => {
  //   const cardWrapper = new CustomElement("div", {
  //     className: "section__cards-card card",
  //   });

  //   const cardImage = new CustomElement("img", {
  //     className: "card__image",
  //     src: `${config.API.URL}/${word.image}`,
  //     alt: word.word,
  //   });

  //   const cardInfo = new CustomElement("div", {
  //     className: "card__info",
  //   });

  //   const resources = [
  //     word.word,
  //     word.transcription,
  //     word.wordTranslate,
  //     word.textMeaning,
  //     word.textMeaningTranslate,
  //     word.textExample,
  //     word.textExampleTranslate,
  //   ];

  //   resources.forEach((res) => {
  //     const fieldElement = new CustomElement("p", {
  //       className: "card__info-field",
  //       innerHTML: res,
  //     });
  //     cardInfo.addChildren([fieldElement.element]);
  //   });

  // const soundElement = new CustomElement("img", {
  //   className: "card__sound",
  //   src: soundIcon,
  //   alt: "sound-icon",
  // });

  const imageElement = new Control(bookItem.node, "img", "book__item-image");
  const image = imageElement.node as HTMLImageElement;
  image.src = `${API_URL}/${word.image}`;
  image.alt = word.word;

  new Control(bookItem.node, "h1", "book__item-word", word.word);
  [
    word.transcription,
    word.wordTranslate,
    word.textMeaning,
    word.textMeaningTranslate,
    word.textExample,
    word.textExampleTranslate,
  ].forEach((textElem) => new Control(bookItem.node, "p", "", textElem));

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
};

export default createWordItem;
