import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../../context/Context";
import classes from "./AllProjectPage.module.css";

const ProjectPreviewBox = ({ name, proj }) => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const onProjectClickHandler = () => {
    context.currentProject = proj;
    navigate("/project_overview");
  };

  return (
    <div
      onClick={onProjectClickHandler}
      className={`${classes.container} ${classes.clickable}`}
    >
      <h2>{name}</h2>
    </div>
  );
};

export default ProjectPreviewBox;
