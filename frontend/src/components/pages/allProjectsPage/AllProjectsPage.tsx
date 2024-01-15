import { useEffect, useState } from "react";
import {
  getAllProjects,
  createProject,
  getProjectsByUser,
} from "../../../API/ProjectAPIcalls";
import ProjectPreviewBox from "./ProjectPreviewBox";
import { Project } from "../../../interfaces";
import { When } from "react-if";
import { useUsersStore } from "../../../store/usersStore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AddProjectModal from "./AddProjectModal";

const AllProjectPage = () => {
  const { activeUser } = useUsersStore();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [myProjects, setMyProjects] = useState(
    activeUser && activeUser.projects
  );

  const MySwal = withReactContent(Swal);

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
  const handleAddNewProject = () => {
    MySwal.fire({
      title: "Add new project",
      width: 600,
      html: <AddProjectModal />,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonText: "Cancel",
      confirmButtonText: "Save",
      background: "white",
      color: "black",
    });
  };

  useEffect(() => {
    fetchAllProjects();
    fetchUsersProject();
  }, []);

  return (
    <div className="  flex flex-col gap-6 m-8 ">
      <When condition={activeUser && activeUser.isAdmin}>
        <button
          className=" border rounded-lg p-2 bg-indigo-500 text-white font-extrabold hover:scale-105 w-32 h-12 "
          onClick={handleAddNewProject}
        >
          Add project
        </button>
      </When>

      <When condition={activeUser && activeUser.projects.length > 0}>
        <div className="">
          <h2 className=" ">My projects:</h2>
          <div className=" border border-black rounded  p-2 flex gap-2 bg-indigo-100">
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
