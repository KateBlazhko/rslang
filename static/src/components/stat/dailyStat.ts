import Control from '../common/control';
import Input from '../common/Input';
import ButtonStat from './buttonStat';

// enum TextInner {
//   daily = 'Daily stats',
//   general = 'General stats'
// }

class DailyStat extends Control {
  private buttonWrap: Control
  private statWrap: Control | null = null

  constructor(
    public parentNode: HTMLElement | null,
  ) {
    super(parentNode, 'div', 'stat__daily daily');

    this.buttonWrap = new Control(this.node, 'div', 'daily__button-wrap');
    const buttonName = ['sprint', 'audio', 'book']
    const buttonList = buttonName.map(name => {
      return this.drawButton(name)
    
    })

    const [ firstButton ] = buttonList
    firstButton.node.classList.add('active')
    this.getStat(firstButton.name)

    buttonList.forEach((button, indexButton, arr) => {
      button.node.onclick = () => {
        button.node.classList.add('active')

        arr
          .filter((_item, index) => index !== indexButton)
          .forEach((item) => {
            item.node.classList.remove('active')
        })
        this.getStat(button.name)
      }
      return button
    })
  }

  private drawButton(name: string) {
    const icon = new ButtonStat(this.buttonWrap.node, `daily__icon`, '', name);

    const img = new Control<HTMLImageElement>(icon.node, 'img', 'daily__img');
    img.node.src = `./assets/img/${name}.png`;
    const text = new Control(icon.node, 'div', `daily__text`);
    text.node.innerHTML = `
    <span>${name[0].toUpperCase()}${name.slice(1)}</span>
    `;
    return icon;
  }

  private getStat(name: string) {
    this.drawStat(name)
  }

  private drawStat(name: string) {
    if (this.statWrap) this.statWrap.destroy()
    
    this.statWrap = new Control(this.node, 'div', 'daily__stat-wrap');

    const title = new Control(this.statWrap.node, 'h3', 'daily__name', name[0].toUpperCase() + name.slice(1))

  }
}

export default DailyStat;
