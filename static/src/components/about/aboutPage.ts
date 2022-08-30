import ButtonHref from "../common/ButtonHref";
import Control from "../common/control";
import TEAM_DATA from "./teamData";

enum TextInner {
  title = "Our team",
  introductoryText = "We are Team #26 of the Rolling Scopes School JavaScript/Front-end course, providing you with an app to learn English!",
}

interface ITeamMember {
  name: string;
  link: string;
  position: string;
  avatar: string;
}

class AboutPage extends Control {
  private teamWrap: Control;

  constructor(private parentNode: HTMLElement | null) {
    super(parentNode, "div", "about");
    const titleTeamWrap = new Control(this.node, "div", "about__block-wrap");
    new Control(titleTeamWrap.node, "h2", "about__title", TextInner.title);
    new Control(
      titleTeamWrap.node,
      "span",
      "about__text",
      TextInner.introductoryText
    );

    this.teamWrap = new Control(this.node, "div", "about__team");

    this.initPage();
  }

  private initPage() {
    this.drawTeam();
  }

  private drawTeam() {
    TEAM_DATA.forEach((teamMemberItem: ITeamMember) =>
      this.drawTeamMember(teamMemberItem)
    );
  }

  private drawTeamMember(teamMemberItem: ITeamMember) {
    const teamMemberWrap = new Control(
      this.teamWrap.node,
      "div",
      "about__team-member"
    );

    const avatarWrap = new ButtonHref(
      teamMemberWrap.node,
      `${teamMemberItem.link}`,
      "",
      `about__avatar-wrap`
    );
    avatarWrap.node.setAttribute("target", "_blank");

    const avatarImage = new Control<HTMLImageElement>(
      avatarWrap.node,
      "img",
      "about__avatar-img"
    );
    avatarImage.node.src = teamMemberItem.avatar;

    new Control(
      teamMemberWrap.node,
      "p",
      "about__team-member-name",
      teamMemberItem.name
    );
    new Control(
      teamMemberWrap.node,
      "p",
      "about__team-member-name",
      teamMemberItem.position
    );
  }
}

export default AboutPage;
