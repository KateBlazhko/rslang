import Words, { IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import Signal from '../common/signal';
import BASELINK from '../constants/url';
import { IStateLog } from '../login/Logging';
import { adapterDate } from '../utils/functions';
import Notification from '../common/notification';

class CardBook extends Control {
  word: IWord;

  audio: HTMLImageElement[]

  description: Control;
  imageWrap: Control;
  buttonWrap: Control;

  user: IStateLog;

  UserWord: IUserWord | undefined;

  constructor(
    parentNode: HTMLElement | null,
    word: IWord,
    private sounds: string[],
    user: IStateLog,
    public onAudioPlay: Signal<boolean>,
    public onMarkedWords?: Signal<Record<string, boolean>>
  ) {
    super(parentNode, 'div', 'card_item');
    this.user = user;
    this.sounds = sounds;
    this.word = word;
    this.audio = [];
    this.UserWord = undefined;
    this.imageWrap = new Control(this.node, 'div', 'img-wrap');
    this.buttonWrap = new Control(this.node, 'div', 'button-wrap');
    this.description = new Control(this.node, 'div', 'description');
    this.createCard();
  }

  createCard() {
    const img = new Control<HTMLImageElement>(this.imageWrap.node, 'img', 'img__word');
    img.node.src = `${BASELINK}/${this.word.image}`;
    this.createButtons()

    const { description } = this;
    this.createTitle(description.node);
    this.createExample(description.node);
    this.createMeaning(description.node);
  }

  createButtons() {
    const volume = new Control<HTMLImageElement>(this.buttonWrap.node, 'img', 'img__button');
    volume.node.src = '../../assets/icons/volume.png';
    volume.node.addEventListener('click', async () => {
      this.onAudioPlay.emit(true)

      const firstSound = new Audio(this.sounds[0]);
      const secondSound = new Audio(this.sounds[1]);
      const thirdSound = new Audio(this.sounds[2]);

      await firstSound.play();

      setTimeout(async () => {
        await secondSound.play();

        setTimeout(async () => {
          await thirdSound.play();

          setTimeout(() => {
            this.onAudioPlay.emit(false)
          }, thirdSound.duration * 1000);
        }, (firstSound.duration + secondSound.duration) * 1000);
      }, firstSound.duration * 1000);

    });
    this.audio.push(volume.node);
  }


  createTitle(node: HTMLElement) {
    const container = new Control(node, 'div', 'title');
    container.node.innerHTML = `<h3 class="en">${this.word.word}</h3><h3>${this.word.transcription}</h3><h3>${this.word.wordTranslate}</h3>`;
  }

  async checkDifficult(userWord: IUserWord, difficult: 'easy' | 'hard', isLearn?: boolean) {
    const word = userWord;
    await Words.updateUserWord(
      this.user.userId,
      this.user.token,
      userWord.optional.wordId,
      {
        difficulty: difficult,
        optional: {
          wordId: word.optional.wordId,
          сountRightAnswer: word.optional.сountRightAnswer,
          countError: word.optional.countError,
          seriesRightAnswer: word.optional.seriesRightAnswer,
          // isLearn: isLearn ?? word.optional.isLearn,
          isLearn: false,
          dataGetNew: word.optional.dataGetNew,
          // dataLearn: (
          //   word.optional.isLearn
          //         && word.optional.isLearn !== userWord.optional.isLearn)
          //   ? adapterDate(new Date()) : undefined,
          dataLearn: undefined
        },
      },
    );
  }

  async checkStudy(userWord: IUserWord, isLearn: boolean, difficult?: 'easy' | 'hard') {
    const word = userWord;
    await Words.updateUserWord(
      this.user.userId,
      this.user.token,
      userWord.optional.wordId,
      {
        // difficulty: difficult || 'easy',
        difficulty: 'easy',
        optional: {
          wordId: word.optional.wordId,
          сountRightAnswer: word.optional.сountRightAnswer,
          countError: word.optional.countError,
          seriesRightAnswer: word.optional.seriesRightAnswer,
          isLearn: isLearn,
          dataGetNew: word.optional.dataGetNew,
          // dataLearn: (
          //   word.optional.isLearn
          //         && word.optional.isLearn !== userWord.optional.isLearn)
          //   ? adapterDate(new Date()) : undefined,
          dataLearn: isLearn ? adapterDate(new Date()) : undefined,
        },
      },
    );
  }

  async createWord(word: IWord) {
    const wordNew = await Words.createUserWord(this.user.userId, this.user.token, word.id, {
      difficulty: 'easy',
      optional: {
        wordId: word.id,
        сountRightAnswer: 1,
        countError: 0,
        seriesRightAnswer: 0,
        isLearn: false,
        // dataGetNew: adapterDate(new Date()),
        dataGetNew: undefined,
      },
    });
    const userWord = await Words.getUserWordByID(this.user.userId, this.user.token, word.id);

    return userWord;
  }

  createBtnDifficultAndStudy(node: HTMLElement, word: IWord, userWord?: IUserWord) {
    const difficultBtn = new Control(node, 'div', 'button button_difficult');
    difficultBtn.node.title = 'Mark difficult'
    const studyBtn = new Control(node, 'div', 'button button_studied');
    studyBtn.node.title = 'Mark studied'

    if (userWord?.difficulty === 'hard') {
      // difficultBtn.node.textContent = 'Delete';
      difficultBtn.node.classList.add('active');

      this.node.classList.add('difficult');
      this.node.classList.remove('study');
    }

    if (userWord?.optional.isLearn) {
      // studyBtn.node.textContent = 'Studied';
      studyBtn.node.classList.add('active');

      this.node.classList.add('study');
      this.node.classList.remove('difficult');
    }

    if (userWord) {
      this.UserWord = userWord;
    }

    let difficult = this.UserWord?.difficulty;
    let learn = this.UserWord?.optional.isLearn;

    difficultBtn.node.addEventListener('click', async () => {
      if (!this.UserWord) {
        this.UserWord = await this.createWord(word);
      }

      if (difficult === 'hard') {
        difficult = 'easy';
        this.onMarkedWords?.emit({[word.id]: false})
        // difficultBtn.node.textContent = 'Difficult';
        difficultBtn.node.classList.remove('active');
        this.node.classList.remove('difficult');
        await this.checkDifficult(this.UserWord!, 'easy', false);
      } else {
        difficult = 'hard';
        learn = false;
        this.onMarkedWords?.emit({[word.id]: true})
        // difficultBtn.node.textContent = 'Delete';
        // studyBtn.node.textContent = 'Study';
        difficultBtn.node.classList.add('active');
        studyBtn.node.classList.remove('active');

        this.node.classList.add('difficult');
        this.node.classList.remove('study');
        await this.checkDifficult(this.UserWord, 'hard', false);
      }
      // this.checkAllCards();
    });
    studyBtn.node.addEventListener('click', async () => {
      if (!this.UserWord) {
        this.UserWord = await this.createWord(word);
      }

      if (learn) {
        learn = false;
        this.onMarkedWords?.emit({[word.id]: false})
        // studyBtn.node.textContent = 'Study';
        studyBtn.node.classList.remove('active');
        this.node.classList.remove('study');
        await this.checkStudy(this.UserWord!, false, 'easy');
      } else {
        learn = true;
        difficult = 'easy';
        this.onMarkedWords?.emit({[word.id]: true})

        // studyBtn.node.textContent = 'Studied';
        // difficultBtn.node.textContent =  'Difficult';

        studyBtn.node.classList.add('active');
        difficultBtn.node.classList.remove('active');

        this.node.classList.add('study');
        this.node.classList.remove('difficult');
        await this.checkStudy(this.UserWord!, true, 'easy');
      }
      // this.checkAllCards();
    });
  }

  addUserFunctional(word: IWord, userWords?: IUserWord[]) {
    const userWord = userWords?.find((el) => el.optional.wordId === word.id);
    this.createBtnDifficultAndStudy(this.buttonWrap.node, word, userWord);
    this.createUserButton(this.buttonWrap.node, word, userWord);
  }
  // studied

  createUserButton(node: HTMLElement, word: IWord, userWord?: IUserWord) {
    const user = new Control<HTMLImageElement>(node, 'div', 'button button_userWords');

    if (userWord) {
      user.node.classList.add('active')

      user.node.onclick = () => {
        const errors = userWord.optional.countError
        const right = userWord.optional.сountRightAnswer
        const text = `
        You answered this word wrong ${errors} times \n
        You answered this word correctly ${right} times
        `

        const notification = new Notification(this.node, "notification", text);
      }

    }
  };


  createExample(node: HTMLElement) {
    const container = new Control(node, 'div', 'example');
    container.node.innerHTML = `
      <fieldset>
        <legend>Example</legend>
        ${this.word.textExample}
        <br>
        ${this.word.textExampleTranslate}
      </fieldset>
    `;
    // const audio = new Audio(`${BASELINK}/${this.word.audioExample}`);
    // const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    // volume.node.src = '../../assets/icons/volume.png';
    // volume.node.addEventListener('click', () => {
    //   this.allAudio.forEach((el) => el.pause());
    //   audio.play();
    // });
    // this.audio.push(audio);
  }

  createMeaning(node: HTMLElement) {
    const container = new Control(node, 'div', 'example');
    container.node.innerHTML = `
      <fieldset>
        <legend>Meaning</legend>
        ${this.word.textMeaning}
        <br>
        ${this.word.textMeaningTranslate}
      </fieldset>
  
    `;
    // const audio = new Audio(`${BASELINK}/${this.word.audioMeaning}`);
    // const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    // volume.node.src = '../../assets/icons/volume.png';
    // volume.node.addEventListener('click', () => {
    //   this.allAudio.forEach((el) => el.pause());
    //   audio.play();
    // });
    // this.audio.push(audio);
  }

  // eslint-disable-next-line class-methods-use-this
  difficultListen() {
    this.node.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        this.destroy();
      }
    });
  }
}

export default CardBook;
