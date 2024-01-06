import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../../context/Context";
import classes from "./AllProjectPage.module.css";

const ProjectPreviewBox = (props) => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const onProjectClickHandler = () => {
    context.currentProject = props.proj;
    navigate("/project_overview");
  };
  return (
    <div onClick={onProjectClickHandler} className={classes.container}>
      <h2>{props.name}</h2>
    </div>
  );
};

export default ProjectPreviewBox;
