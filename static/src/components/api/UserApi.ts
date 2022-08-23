class ErrorUser {
  status: number;

  errorMessage: string;

  constructor(response: Response) {
    this.status = response.status;
    this.errorMessage = '';
  }

  getErrorMessage(statusCode: number) {
    if (statusCode === 404) {
      this.errorMessage = 'пользователя с данным Email не существует';
    }
    if (statusCode === 403) {
      this.errorMessage = 'вы указали неверный пароль';
    }
    if (statusCode === 417) {
      this.errorMessage = 'пользователя с таким Email уже существует';
    }
  }
}
