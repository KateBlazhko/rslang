class ErrorUser {
  status: number;

  errorMessage: string;

  constructor(response: Response) {
    this.status = response.status;
    this.errorMessage = '';
  }

  static getErrorMessage(statusCode: number, node: HTMLElement) {
    let message: string = '';
    if (statusCode === 404) {
      message = 'пользователя с данным Email не существует';
    }
    if (statusCode === 403) {
      message = 'вы указали неверный пароль';
    }
    if (statusCode === 417) {
      message = 'пользователя с таким Email уже существует';
    }
    node.innerHTML = message;
  }
}

export default ErrorUser;
