import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../../context/context";
import { Project } from "../../../interfaces";

interface IProjectPreviewBox {
  projectName: string;
  project: Project;
}
const ProjectPreviewBox: React.FC<IProjectPreviewBox> = ({
  projectName,
  project,
}) => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const onProjectClickHandler = () => {
    context.currentProject = project;
    navigate("/project_overview");
  };

  return (
    <div onClick={onProjectClickHandler} className={``}>
      <h2>{projectName}</h2>
    </div>
  );
};

export default ProjectPreviewBox;
