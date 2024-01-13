import { Fragment, useEffect, useState } from "react";
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
import { Project } from "../../../interfaces";
import { When } from "react-if";
import { useUsersStore } from "../../../store/usersStore";

const AllProjectPage = () => {
  const { activeUser } = useUsersStore();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [myProjects, setMyProjects] = useState(
    activeUser && activeUser.projects
  );
  const [openModal, setOpenModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const fetchAllProjects = async () => {
    const projects = await getAllProjects();
    setAllProjects(projects);
  };

  const fetchUsersProject = async () => {
    if (!activeUser) return;

    const projects = await getProjectsByUser(activeUser);
    console.log("projects:", projects);
    setMyProjects(projects);
  };

  const onChangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const onCreateProjectHandler = async (e) => {
    e.preventDefault();
    const project = await createProject(projectName);
    setAllProjects([...allProjects, project]);
    setOpenModal(false);
  };

  useEffect(() => {
    fetchAllProjects();
    fetchUsersProject();
  }, []);

  return (
    <Fragment>
      <When condition={openModal}>
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
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      </When>
      <When condition={activeUser && activeUser.isAdmin}>
        <Button style="margin" onClick={() => setOpenModal(true)}>
          Add project
        </Button>
      </When>

      <When condition={activeUser && activeUser.projects.length > 0}>
        <div>
          <h2 className={classes.title}>My projects:</h2>
          <BoxRow>
            {myProjects!.map((project, index) => (
              <ProjectPreviewBox
                projectName={project.name}
                key={index}
                project={project}
              />
            ))}
          </BoxRow>
        </div>
        <div>
          <div>
            <h2 className={classes.title}>All projects:</h2>
            <BoxRow>
              {allProjects.map((project, index) => (
                <ProjectPreviewBox
                  projectName={project.name}
                  key={index}
                  project={project}
                />
              ))}
            </BoxRow>
          </div>
        </div>
      </When>
    </Fragment>
  );
};

export default AllProjectPage;
