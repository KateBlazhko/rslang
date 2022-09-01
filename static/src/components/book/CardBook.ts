import Words, { BASELINK, IUserWord, IWord } from '../api/Words';
import Control from '../common/control';
import { IStateLog } from '../Logging';

class CardBook extends Control {
  word: IWord;

  audio: HTMLAudioElement[];

  allAudio: HTMLAudioElement[];

  description: Control<HTMLElement>;

  user: IStateLog;

  UserWord: IUserWord | undefined;

  constructor(
    parentNode: HTMLElement | null,
    word: IWord,
    allAudio: HTMLAudioElement[],
    user: IStateLog,
  ) {
    super(parentNode, 'div', 'card_item');
    this.user = user;
    this.allAudio = allAudio;
    this.word = word;
    this.audio = [];
    this.UserWord = undefined;
    this.description = new Control(this.node, 'div', 'description');
    this.createCard();
  }

  createCard() {
    const img = new Control<HTMLImageElement>(this.node, 'img', 'img__word');
    img.node.src = `${BASELINK}/${this.word.image}`;
    const { description } = this;
    this.createTitle(description.node);
    this.createExample(description.node);
    this.createMeaning(description.node);
  }

  createTitle(node: HTMLElement) {
    const container = new Control(node, 'div', 'title');
    container.node.innerHTML = `<h3 class="en">${this.word.word}</h3><h3>${this.word.transcription}</h3><h3>${this.word.wordTranslate}</h3>`;
    const audio = new Audio(`${BASELINK}/${this.word.audio}`);
    const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    volume.node.src = '../../assets/icons/volume.png';
    volume.node.addEventListener('click', () => {
      this.allAudio.forEach((el) => el.pause());
      audio.play();
    });
    this.audio.push(audio);
  }

  async checkDifficult(userWord: IUserWord, difficult: 'easy' | 'hard', learn?: boolean) {
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
          isLearn: learn || word.optional.isLearn,
          dataGetNew: word.optional.dataGetNew,
          dataLearn: (
            word.optional.isLearn
                  && word.optional.isLearn !== userWord.optional.isLearn)
            ? new Date() : undefined,
        },
      },
    );
  }

  async checkStudy(userWord: IUserWord, learn: boolean, difficult?: 'easy' | 'hard') {
    const word = userWord;
    await Words.updateUserWord(
      this.user.userId,
      this.user.token,
      userWord.optional.wordId,
      {
        difficulty: difficult || 'easy',
        optional: {
          wordId: word.optional.wordId,
          сountRightAnswer: word.optional.сountRightAnswer,
          countError: word.optional.countError,
          seriesRightAnswer: word.optional.seriesRightAnswer,
          isLearn: learn,
          dataGetNew: word.optional.dataGetNew,
          dataLearn: (
            word.optional.isLearn
                  && word.optional.isLearn !== userWord.optional.isLearn)
            ? new Date() : undefined,
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
        dataGetNew: new Date(),
      },
    });
    const userWord = await Words.getUserWordByID(this.user.userId, this.user.token, word.id);

    return userWord;
  }

  createBtnDifficultAndStudy(node: HTMLElement, word: IWord, userWord?: IUserWord) {
    const difficultBtn = new Control(node, 'button', 'button_difficult', 'Difficult');
    const studyBtn = new Control(node, 'button', 'button_studied', 'Study');

    if (userWord?.difficulty === 'hard') {
      difficultBtn.node.textContent = 'Delete';
      this.node.classList.add('difficult');
      this.node.classList.remove('study');
    }

    if (userWord?.optional.isLearn) {
      studyBtn.node.textContent = 'Studied';
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
        difficultBtn.node.textContent = 'Difficult';
        this.node.classList.remove('difficult');
        await this.checkDifficult(this.UserWord!, 'easy');
      } else {
        difficult = 'hard';
        learn = false;
        difficultBtn.node.textContent = 'Delete';
        studyBtn.node.textContent = 'Study';
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
        studyBtn.node.textContent = 'Study';
        this.node.classList.remove('study');
        await this.checkStudy(this.UserWord!, false);
      } else {
        learn = true;
        difficult = 'easy';
        studyBtn.node.textContent = 'Studied';
        difficultBtn.node.textContent = 'Difficult';
        this.node.classList.add('study');
        this.node.classList.remove('difficult');
        await this.checkStudy(this.UserWord!, true, 'easy');
      }
    });
  }

  addUserFunctional(word: IWord, userWords?: IUserWord[]) {
    const userWord = userWords!.find((el) => el.optional.wordId === word.id);
    const containerBtn = new Control(this.description.node, 'div', 'container-btn');
    // this.createDifficultBtn(containerBtn.node, word, userWord);
    // this.createStudiedBtn(containerBtn.node, word, userWord);
    this.createBtnDifficultAndStudy(containerBtn.node, word, userWord);
  }
  // studied

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
    const audio = new Audio(`${BASELINK}/${this.word.audioExample}`);
    const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    volume.node.src = '../../assets/icons/volume.png';
    volume.node.addEventListener('click', () => {
      this.allAudio.forEach((el) => el.pause());
      audio.play();
    });
    this.audio.push(audio);
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
    const audio = new Audio(`${BASELINK}/${this.word.audioMeaning}`);
    const volume = new Control<HTMLImageElement>(container.node, 'img', 'volume');
    volume.node.src = '../../assets/icons/volume.png';
    volume.node.addEventListener('click', () => {
      this.allAudio.forEach((el) => el.pause());
      audio.play();
    });
    this.audio.push(audio);
  }
}

export default CardBook;
