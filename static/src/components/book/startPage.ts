import { IWord } from "../api/Words";
import Control from "../common/control";
import ButtonAnswer from "./buttonAnswer";
import BookState from "./bookState";
import API_URL from "../../constants/api";
import createWordItem from "./createWordItem";

enum TextInner {
  title = "Book",
  pagesText = "Choose page",
  levelsText = "Choose level",
}

const COUNTLEVELS = 6;

class StartPage extends Control {
  constructor(
    private parentNode: HTMLElement | null,
    private words: IWord[],
    private state: BookState
  ) {
    super(parentNode, "div", "book__start start");
    this.renderStartPage();
  }

  private renderStartPage() {
    const pagesText = new Control(
      this.node,
      "div",
      "start__desription start__desription_odd"
    );
    pagesText.node.innerHTML = `
    <span>${TextInner.pagesText}</span>
    <div class="start__button-wrap start__button-wrap_pseudo">
      <div class="start__button start__button_pseudo"><span>←</span></div>
      <div class="start__button start__button_pseudo"><span>→</span></div>
    </div>
    `;

    const wordsBlock = new Control(this.node, "div", "book__wrapper");

    this.words.forEach((wordItem) => {
      const bookItem = new Control(wordsBlock.node, "div", "book__item");
      createWordItem(wordItem, bookItem);
      //   soundElement.element.addEventListener("click", async () => {
      //     const sounds = [
      //       `${API_URL}/${word.audio}`,
      //       `${API_URL}/${word.audioMeaning}`,
      //       `${API_URL}/${word.audioExample}`,
      //     ];
      //     const playSound1 = new Audio(sounds[0]);
      //     await playSound1.play();
      //     const playSound1Duration = playSound1.duration * 1000;
      //     const playSound2 = new Audio(sounds[1]);
      //     setTimeout(async () => {
      //       await playSound2.play();
      //       const playSound2Duration =
      //         (playSound1.duration + playSound2.duration) * 1000;
      //       const playSound3 = new Audio(sounds[2]);
      //       setTimeout(async () => {
      //         await playSound3.play();
      //       }, playSound2Duration);
      //     }, playSound1Duration);
      //   });
      //   wordsBlock.node.innerHTML += `
      // <div class="book__item">
      //     <img class="book__item-image" src="${API_URL}/${wordItem.image}" alt="${wordItem.word}"/>
      //     <h1 class="book__item-word">${wordItem.word}</h1>
      //     <p>${wordItem.transcription}</p>
      //     <p>${wordItem.wordTranslate}</p>
      //     <p>${wordItem.textMeaning}</p>
      //     <p>${wordItem.textMeaningTranslate}</p>
      //     <p>${wordItem.textExample}</p>
      //     <p>${wordItem.textExampleTranslate}</p>
      //     <div class="book__item-sound" data-audio="${wordItem.audio}"></div>
      // </div>`;

      //   const audioItem = document.querySelector(".book__item-sound");

      //   audioItem?.addEventListener("click", (event) => {
      //     console.log(wordItem.audio);
      //     new Audio(`${API_URL}/${wordItem.audio}`).play();
      //   });
      //   playSound();
      //   console.log(wordItem);
    });

    // this.words.forEach(wordItem => {
    //     const audioItem = document.querySelector(`"[data-audio=${word.audio}]"`)
    // })

    console.log("words-words", this.words);

    const button = new Control(
      this.node,
      "div",
      "start__desription start__desription_even",
      TextInner.levelsText
    );
    const buttonWrap = new Control(button.node, "div", "start__button-wrap");

    [...Array(COUNTLEVELS).keys()].map((item) => {
      const button = new ButtonAnswer(
        buttonWrap.node,
        "start__button",
        (item + 1).toString()
      );
      button.node.onclick = () => {
        this.state.onPreload.emit([item]);
        this.destroy();
      };

      return button;
    });
  }

  public render() {
    return this.node;
  }
}

export default StartPage;
