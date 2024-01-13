import { Fragment, useEffect, useState } from "react";
import {
  getAllProjects,
  createProject,
  getProjectsByUser,
} from "../../../API/ProjectAPIcalls";
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

  const onCreateProjectHandler = async () => {
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
          <form className=" addproject" onSubmit={onCreateProjectHandler}>
            <div className={""}>
              <label htmlFor="projectName">Project name:</label>
              <input type="text" onChange={onChangeInputHandler} />
            </div>
            <div className=" ">
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
          <h2 className=" ">My projects:</h2>
          <div>
            {myProjects!.map((project, index) => (
              <ProjectPreviewBox
                projectName={project.name}
                key={index}
                project={project}
              />
            ))}
          </div>
        </div>
        <div>
          <div>
            <h2 className="">All projects:</h2>
            <div className=" flex gap-2 ">
              {allProjects.map((project, index) => (
                <ProjectPreviewBox
                  projectName={project.name}
                  key={index}
                  project={project}
                />
              ))}
            </div>
          </div>
        </div>
      </When>
    </Fragment>
  );
};

export default AllProjectPage;
