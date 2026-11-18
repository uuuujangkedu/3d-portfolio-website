import { useContent } from "../context/ContentProvider";
import "./styles/Skills.css";

const Skills = () => {
  const { skills } = useContent();
  if (!skills || !skills.items || !skills.items.length) {
    return <div id="skills" />;
  }

  return (
    <div className="skills-section section-container" id="skills">
      <h2>
        {skills.title || "My Skills"} <span>&</span>
        <br /> expertise
      </h2>
      <div className="skills-grid">
        {skills.items.map((skill, index) => (
          <div className="skill-card" key={index}>
            <h4>{skill.name}</h4>
            <span className="skill-level">{skill.level}</span>
            {skill.description ? <p>{skill.description}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
