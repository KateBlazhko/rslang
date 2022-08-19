class SprintState {
  private initiator: string = 'header'
  private soundPlay: boolean = true

  public setInitiator(page: string) {
    this.initiator = page === 'book' ? 'book': 'header'
  }

  public getInitiator() {
    return this.initiator
  }

  public setSoundPlay(value: boolean) {
    this.soundPlay = value
  }

  public getSoundPlay() {
    return this.soundPlay
  }
}

export default SprintState