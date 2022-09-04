class ErrorNewWord {
  status: number;

  errorMessage: string;

  constructor(response: Response) {
    this.status = response.status;
    this.errorMessage = "";
  }

  static getErrorMessage(statusCode: number, node: HTMLElement) {
    let message: string = "Bad request";

    if (statusCode === 417) {
      message = "Entity with this name exists";
    }

    node.innerHTML = message;
  }
}

export default ErrorNewWord;
