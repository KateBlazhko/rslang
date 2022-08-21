class SoundManager {
  private baseURL = `./assets/sound/`;
  private audioTimer: HTMLAudioElement | null = null

  public playOk(){
    this.playSound('ok');  
  }

  public playFail(){
    this.playSound('fail');  
  }

  public playTimer(){
    this.audioTimer = this.playSound('timer')

  }

  private playSound(name:string) {
    const audio = new Audio(`${this.baseURL}${name}.mp3`);
    audio.play();
    return audio
  }

  public stopPlayTimer() {
    if (this.audioTimer) this.audioTimer.pause()
  }

  public restartPlayTimer() {
    if (this.audioTimer?.paused) this.audioTimer.play()
  }
}

export const soundManager = new SoundManager();