import content from "../data/content.json";
import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{content.about.title}</h3>
        <p className="para">{content.about.paragraph}</p>
      </div>
    </div>
  );
};

export default About;