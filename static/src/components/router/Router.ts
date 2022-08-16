class Router {
  private location: Location;

  private container: HTMLElement;

  constructor() {
    this.location = window.location;
    this.container = document.createElement('main');
    this.hashChange();
  }

  hashChange() {
    window.addEventListener('hashchange', () => {
      console.log(this.location.hash);
      switch (this.location.hash.slice(1)) {
        case 'home':
          this.container.innerHTML = '<h1>Home</h1>';
          break;
        case 'about':
          this.container.innerHTML = '<h1>About Us</h1>';
          break;
        case 'book':
          this.container.innerHTML = '<h1>Book</h1>';
          break;
        case 'sprint':
          this.container.innerHTML = '<h1>Sprint</h1>';
          break;
        case 'audio':
          this.container.innerHTML = '<h1>Audio</h1>';
          break;
        case 'statistics':
          this.container.innerHTML = '<h1>statistics</h1>';
          break;
        default:
          this.container.innerHTML = '<h1>Home</h1>';
      }
    });
  }

  render() {
    return this.container;
  }
}

export default Router;
