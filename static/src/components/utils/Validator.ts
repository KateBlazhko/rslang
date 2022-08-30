import Input from '../common/Input';

class Validator {
  static validate(patternType: 'name' | 'email' | 'password', value: Input) {
    let state = false;
    let pattern: RegExp;
    let warningMessage: string;
    value.label.querySelector('.warning__div')?.remove();

    if (patternType === 'email') {
      warningMessage = `Email is not correct, check please`;
      pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    } else if (patternType === 'password') {
      warningMessage = 'Your password is not correct, it must be at least 8 characters long and contain letters and numbers';
      pattern = /[0-9a-zA-Z!@#$%^&*]{8,}/;
    } else {
      warningMessage = 'You did not enter your name';
      pattern = /[0-9a-zA-Zа-яА-Я!@#$%^&*]{1,}/;
    }

    const valueInput = value.input.value;

    if (!pattern.test(valueInput)) {
      value.input.className = 'no_valid';
      value.label.insertAdjacentHTML('beforeend', `<div class="warning__div">${warningMessage}</div>`);
    } else {
      value.input.classList.remove('no_valid');
      value.label.querySelector('.warning__div')?.remove();
      state = true;
    }
    return state;
  }

  static removeAllWarning(...arr: Array<Input>) {
    arr.forEach((item) => {
      item.node.querySelector('.warning__div')?.remove();
      item.input.classList.remove('no_valid');
      item.input.value = '';
    });
  }

  static addListen(patternType: 'name' | 'email' | 'password', value: Input) {
    value.input.addEventListener('change', () => {
      Validator.validate(patternType, value);
    });
  }
}

export default Validator;
