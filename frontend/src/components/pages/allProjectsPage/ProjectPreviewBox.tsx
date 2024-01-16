import { useNavigate } from "react-router-dom";
import { Project } from "../../../interfaces";
import { useProjectsStore } from "../../../store/projectsStore";

interface IProjectPreviewBox {
  project: Project;
}
const ProjectPreviewBox: React.FC<IProjectPreviewBox> = ({ project }) => {
  const navigate = useNavigate();
  const { setActiveProject } = useProjectsStore();
  const onProjectClickHandler = () => {
    setActiveProject(project);
    navigate("/project_overview");
  };

  return (
    <div
      onClick={onProjectClickHandler}
      className={` border-2 border-black rounded-lg p-2  cursor-pointer hover:scale-105 w-20 `}
    >
      <h2>{project.name}</h2>
    </div>
  );
};

export default ProjectPreviewBox;
