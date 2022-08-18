class SprintState {
  private initiator: string

  constructor() {
    this.initiator = 'header'
  }

  public setInitiator(page: string) {
    this.initiator = page === 'book' ? 'book': 'header'
  }

  public getInitiator() {
    return this.initiator
  }
}

export default SprintState