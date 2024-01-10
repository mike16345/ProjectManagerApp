import { Fragment, useContext, useEffect, useState } from "react";
import classes from "./AllProjectPage.module.css";
import {
  getAllProjects,
  createProject,
  getProjectsByUser,
} from "../../../API/ProjectAPIcalls";
import BoxRow from "../../boxRow/BoxRow";
import ProjectPreviewBox from "./ProjectPreviewBox";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import AppContext from "../../../context/context";
import { Project } from "../../../interfaces";
import { When } from "react-if";

const AllProjectPage = (props) => {
  const context = useContext(AppContext);
  const userLoggedProjects = context.userLogged && context.userLogged.projects;

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [myProjects, setMyProjects] = useState(userLoggedProjects);
  const [openModal, setOpenModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const fetchAllProjects = async () => {
    const res = await getAllProjects();
    setAllProjects(res);
  };

  const fetchUsersProject = async () => {
    if (!context.userLogged) return;
    const projects = await getProjectsByUser(context.userLogged);
    setMyProjects(projects);
  };

  const onChangeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const onCreateProjectHandler = async (event) => {
    event.preventDefault();
    const project = await createProject(projectName);
    setAllProjects([...allProjects, project]);
    setOpenModal(false);
  };

  useEffect(() => {
    // fetchAllProjects();
    // fetchUsersProject();
  }, []);

  return (
    <Fragment>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <form
            className={classes.addProjectModal}
            onSubmit={onCreateProjectHandler}
          >
            <div className={classes.input}>
              <label htmlFor="projectName">Project name:</label>
              <input type="text" onChange={onChangeInputHandler} />
            </div>
            <div className={classes.btns}>
              <Button type="submit">Save</Button>
              <Button type="button" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
      <When condition={context.userLogged && context.userLogged.isAdmin}>
        <Button type="button" style="margin" onClick={() => setOpenModal(true)}>
          Add project
        </Button>
      </When>

      <When condition={myProjects && myProjects.length > 0}>
        <div>
          <h2 className={classes.title}>My projects:</h2>
          <BoxRow>
            {myProjects!.map((project, index) => (
              <ProjectPreviewBox key={index} project={project} />
            ))}
          </BoxRow>
        </div>
      </When>

      {allProjects.length > 0 && (
        <div>
          <h2 className={classes.title}>All projects:</h2>
          <BoxRow>
            {allProjects.map((project, index) => (
              <ProjectPreviewBox key={index} project={project} />
            ))}
          </BoxRow>
        </div>
      )}
    </Fragment>
  );
};

export default AllProjectPage;
