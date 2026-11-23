import { useContent } from "../context/ContentProvider";
import CollectionPage from "../collection/CollectionPage";
import ProjectCard from "./ProjectCard";

const AllProjects = () => {
  const { work } = useContent();

  return (
    <CollectionPage
      documentTitle="Projects"
      heading={
        <>
          My <span>Work</span>
        </>
      }
      count={`${work.length} project${work.length === 1 ? "" : "s"}`}
    >
      {work.length ? (
        <div className="card-grid">
          {work.map((project, index) => (
            <ProjectCard project={project} key={`${project.title}-${index}`} />
          ))}
        </div>
      ) : (
        <p className="collection-empty">
          No projects yet. Add them from the admin dashboard.
        </p>
      )}
    </CollectionPage>
  );
};

export default AllProjects;
