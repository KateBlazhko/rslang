import Control from "../common/control";

enum TextInner {
  title = "Our team",
  introductoryText = "We are Team #26 of the Rolling Scopes School JavaScript/Front-end course, providing you with an app to learn English!",
}

class AboutPage extends Control {
  // private teamWrap: Control;

  constructor(private parentNode: HTMLElement | null) {
    super(parentNode, "div", "about");
    const titleWrap = new Control(this.node, "div", "about__block-wrap");
    new Control(titleWrap.node, "h2", "about__title", TextInner.title);
    new Control(
      titleWrap.node,
      "span",
      "about__text",
      TextInner.introductoryText
    );
    // this.teamWrap = new Control(this.node, "div", "about__team");

    this.initPage();
  }

  private initPage() {}

  private drawTeam() {}
}

export default AboutPage;
