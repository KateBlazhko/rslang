import Signal from "../common/signal";

class SprintState {
  private initiator: string = 'header'
  private soundPlay: boolean = true

  public onSoundOn = new Signal<boolean>();

  public setInitiator(page: string) {
    this.initiator = page === 'book' ? 'book': 'header'
  }

  public getInitiator() {
    return this.initiator
  }

  public setSoundPlay(value: boolean) {
    this.soundPlay = value
    this.onSoundOn.emit(value)
  }

  public getSoundPlay() {
    return this.soundPlay
  }
}

export default SprintState