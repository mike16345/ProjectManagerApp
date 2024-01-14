import { useEffect, useState } from "react";
import {
  getAllProjects,
  createProject,
  getProjectsByUser,
} from "../../../API/ProjectAPIcalls";
import ProjectPreviewBox from "./ProjectPreviewBox";
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
    <div className="  flex flex-col gap-6 m-8 ">
      <When condition={openModal}>
        <Modal onClose={() => setOpenModal(false)}>
          <form
            className=" flex flex-col items-center justify-center gap-4"
            onSubmit={onCreateProjectHandler}
          >
            <div className={"flex flex-col gap-1"}>
              <label htmlFor="projectName">Project name:</label>
              <input
                className=" border-2 border-black rounded p-2 "
                placeholder="Project Name"
                type="text"
                onChange={onChangeInputHandler}
              />
            </div>
            <div className=" flex gap-4">
              <button
                className=" border p-2 bg-indigo-500 text-white font-bold rounded-lg w-24 h-12 "
                type="submit"
              >
                Save
              </button>
              <button
                className=" border p-2 bg-indigo-500 text-white font-bold rounded-lg w-24 h-12 "
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </When>
      <When condition={activeUser && activeUser.isAdmin}>
        <button
          className=" border rounded-lg p-2 bg-indigo-500 text-white font-extrabold hover:scale-105 w-32 h-12 "
          onClick={() => setOpenModal(true)}
        >
          Add project
        </button>
      </When>

      <When condition={activeUser && activeUser.projects.length > 0}>
        <div className="">
          <h2 className=" ">My projects:</h2>
          <div className=" border p-2">
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
    </div>
  );
};

export default AllProjectPage;
