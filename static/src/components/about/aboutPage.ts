import ButtonHref from '../common/ButtonHref';
import Control from '../common/control';
import TEAM_DATA from './teamData';

enum TextInner {
  appTitle = 'About app',
  appText = 'Our application allows you to learn more than 3000 English words. The words in the collection are sorted from simpler and more familiar to more complex. Improve your English level by playing our games, use the electronic textbook and track your learning progress!',
  teamTitle = 'Our team',
  teamText = 'We are Team #26 of the Rolling Scopes School JavaScript/Front-end course, providing you with an app to learn English!',
}

interface ITeamMember {
  name: string;
  link: string;
  position: string;
  avatar: string;
  responsibilities: string;
}

class AboutPage extends Control {
  private teamWrap: Control;

  constructor(private parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'about');
    this.drawTitle(TextInner.appTitle, TextInner.appText);
    this.drawTitle(TextInner.teamTitle, TextInner.teamText);

    this.teamWrap = new Control(this.node, 'div', 'about__team');
    this.drawTeam();
  }

  private drawTitle(title: string, text: string) {
    const wrap = new Control(this.node, 'div', 'about__block-wrap');
    const aboutTitle = new Control(wrap.node, 'h2', 'about__title', title);
    const aboutText = new Control(wrap.node, 'span', 'about__text', text);
  }

  private drawTeam() {
    TEAM_DATA.forEach((teamMemberItem: ITeamMember) => {
      const teamMemberWrap = new Control(
        this.teamWrap.node,
        'div',
        'about__team-member',
      );

      const avatarWrap = new ButtonHref(
        teamMemberWrap.node,
        `${teamMemberItem.link}`,
        '',
        'about__avatar-wrap',
      );
      avatarWrap.node.setAttribute('target', '_blank');

      const avatarImage = new Control<HTMLImageElement>(
        avatarWrap.node,
        'img',
        'about__avatar-img',
      );
      avatarImage.node.src = teamMemberItem.avatar;
      const text = [
        new Control(
          teamMemberWrap.node,
          'p',
          'about__team-member-text',
          teamMemberItem.name,
        ),
        new Control(
          teamMemberWrap.node,
          'p',
          'about__team-member-text',
          teamMemberItem.position,
        ),
        new Control(
          teamMemberWrap.node,
          'p',
          'about__team-member-text about__team-member-resp',
          teamMemberItem.responsibilities,
        ),
      ];
    });
  }
}

export default AboutPage;
