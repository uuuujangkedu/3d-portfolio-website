import type { Content } from "../lib/content";
import "../components/styles/CertCard.css";

type Project = Content["work"][number];

const ProjectCard = ({ project }: { project: Project }) => {
  const body = (
    <>
      <img src={project.image} alt={project.title} loading="lazy" />
      <div className="info-card-body">
        <span className="info-card-tag">{project.category}</span>
        <h4>{project.title}</h4>
        <h5>{project.tools}</h5>
        {project.link ? <em className="info-card-link">View project ↗</em> : null}
      </div>
    </>
  );

  return project.link ? (
    <a className="info-card" href={project.link} target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <div className="info-card">{body}</div>
  );
};

export default ProjectCard;
