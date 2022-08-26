import Control from '../common/control';

class GameAudio extends Control {
  constructor() {
    super(null);
    this.audioTimer();
  }

  audioTimer() {
    const timer = new Audio('../../assets/sound/timer.mp3');
  }
}

export default GameAudio;
