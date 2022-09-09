import Words, { IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import Signal from '../common/signal';
// import BASELINK from '../constants/url';
import { IStateLog } from '../login/Logging';
import { adapterDate } from '../utils/functions';
import Notification from '../common/notification';

class CardBook extends Control {
  word: IWord;

  audio: HTMLImageElement[] = [];

  description: Control;

  imageWrap: Control;

  buttonWrap: Control;

  user: IStateLog;

  UserWord: IUserWord | undefined;

  img: Control<HTMLImageElement> | null = null

  isAudioPlay: boolean = false

  track: HTMLAudioElement | null = null

  tracksAll: HTMLAudioElement[] = []

  constructor(
    parentNode: HTMLElement | null,
    word: IWord,
    private sounds: string[],
    user: IStateLog,
    private baselink: string,
    public onAudioPlay: Signal<boolean>,
    public onMarkedWords?: Signal<Record<string, boolean>>,
  ) {
    super(parentNode, 'div', 'card_item');
    this.user = user;
    this.sounds = sounds;
    this.word = word;
    this.UserWord = undefined;
    this.imageWrap = new Control(this.node, 'div', 'img-wrap');
    this.buttonWrap = new Control(this.node, 'div', 'button-wrap');
    this.description = new Control(this.node, 'div', 'description');
    this.onAudioPlay.add(this.setIsAudioPlay.bind(this))
    this.onAudioPlay.add(this.stopAudio.bind(this))
    this.createCard();
  }

  onDeleteWord = new Signal<string>();

  setIsAudioPlay(value: boolean) {
    this.isAudioPlay = value
  }

  getIsAudioPlay() {
    return this.isAudioPlay
  }

  createCard() {
    this.img = new Control<HTMLImageElement>(this.imageWrap.node, 'img', 'img__word');
    if (this.word.image.includes('cloudinary')) {
      this.img.node.src = `${this.word.image}`;

    } else {
      this.img.node.src = `${this.baselink}/${this.word.image}`;

    }

    this.createButtons();

    const { description } = this;
    this.createTitle(description.node);
    this.createExample(description.node);
    this.createMeaning(description.node);
  }

  createButtons() {
    const volume = new Control<HTMLImageElement>(this.buttonWrap.node, 'img', 'img__button');
    volume.node.src = './assets/icons/volume.png';
    volume.node.addEventListener('click', async () => {

      this.onAudioPlay.emit(true);

      this.tracksAll = this.sounds.map(sound => {
        return new Audio(sound)
      })

      this.track = this.tracksAll[0]
      this.track.play()

      this.tracksAll.forEach((track, i, array) => {
        track.addEventListener('ended', this.playNextTrack.bind(this, array, i));
      })

    });
    this.audio.push(volume.node);
  }

  playNextTrack(audio: HTMLAudioElement[], i: number) {

    if (i === audio.length - 1) {
      this.onAudioPlay.emit(false);
      return
    }

    if (this.getIsAudioPlay() && audio[i].duration === audio[i].currentTime) {
      this.track = audio[i + 1]
      this.track.play()
    }
    
  }

  stopAudio() {
    this.track?.pause()
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
          isLearn: false,
          dataGetNew: word.optional.dataGetNew,
          dataLearn: undefined,
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
        difficulty: 'easy',
        optional: {
          wordId: word.optional.wordId,
          сountRightAnswer: word.optional.сountRightAnswer,
          countError: word.optional.countError,
          seriesRightAnswer: word.optional.seriesRightAnswer,
          isLearn,
          dataGetNew: word.optional.dataGetNew,
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
    difficultBtn.node.title = 'Mark difficult';
    const studyBtn = new Control(node, 'div', 'button button_studied');
    studyBtn.node.title = 'Mark studied';

    if (userWord?.difficulty === 'hard') {
      difficultBtn.node.classList.add('active');

      this.node.classList.add('difficult');
      this.node.classList.remove('study');
    }

    if (userWord?.optional.isLearn) {
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
        this.onMarkedWords?.emit({ [word.id]: false });
        difficultBtn.node.classList.remove('active');
        this.node.classList.remove('difficult');
        await this.checkDifficult(this.UserWord!, 'easy', false);
      } else {
        difficult = 'hard';
        learn = false;
        this.onMarkedWords?.emit({ [word.id]: true });
        difficultBtn.node.classList.add('active');
        studyBtn.node.classList.remove('active');

        this.node.classList.add('difficult');
        this.node.classList.remove('study');
        await this.checkDifficult(this.UserWord, 'hard', false);
      }
    });
    studyBtn.node.addEventListener('click', async () => {
      if (!this.UserWord) {
        this.UserWord = await this.createWord(word);
      }

      if (learn) {
        learn = false;
        this.onMarkedWords?.emit({ [word.id]: false });
        studyBtn.node.classList.remove('active');
        this.node.classList.remove('study');
        await this.checkStudy(this.UserWord!, false, 'easy');
      } else {
        learn = true;
        difficult = 'easy';
        this.onMarkedWords?.emit({ [word.id]: true });

        studyBtn.node.classList.add('active');
        difficultBtn.node.classList.remove('active');

        this.node.classList.add('study');
        this.node.classList.remove('difficult');
        await this.checkStudy(this.UserWord!, true, 'easy');
      }
    });
  }

  addUserFunctional(word: IWord, userWords?: IUserWord[]) {
    const userWord = userWords?.find((el) => el.optional.wordId === word.id);
    this.createBtnDifficultAndStudy(this.buttonWrap.node, word, userWord);
    this.createUserButton(this.buttonWrap.node, word, userWord);
  }

  createUserButton(node: HTMLElement, word: IWord, userWord?: IUserWord) {
    const user = new Control<HTMLImageElement>(node, 'div', 'button button_userWords');

    if (userWord?.optional.dataGetNew) {
      user.node.classList.add('active');
      user.node.title = 'Сheck game stats';
      user.node.onclick = () => {
        const errors = userWord.optional.countError;
        const right = userWord.optional.сountRightAnswer;
        const text = `
        You answered this word wrong ${errors} times \n
        You answered this word correctly ${right} times
        `;

        const notification = new Notification(this.node, 'notification', text);
      };
    }
  }

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
  }

  // eslint-disable-next-line class-methods-use-this
  difficultListen(id: string) {
    this.node.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('button_difficult') || target.classList.contains('button_studied')) {
        this.destroy();
        this.onDeleteWord.emit(id);
      }
    });
  }
}

export default CardBook;
