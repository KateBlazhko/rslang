const stopPlayAudio = (items: Array<Element>, event: string) => {
  items.forEach((item) => {
    const soundItem = item as HTMLElement;
    soundItem.style.pointerEvents = event;
    soundItem.style.opacity = event === 'none' ? '0.5' : '1';
  });
};

export default stopPlayAudio;
