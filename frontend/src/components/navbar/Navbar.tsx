import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProfileModal from "./ProfileModal";
import SearchBar from "./SearchBar";
// import logo from "../../logo.png";
import { getProjectsByUser } from "../../API/ProjectAPIcalls";
import { When } from "react-if";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";

interface INavbar {
  isLoggedIn: boolean;
  onLogOutHandler: () => void;
}
const Navbar: React.FC<INavbar> = ({ isLoggedIn, onLogOutHandler }) => {
  const navigate = useNavigate();
  const { activeProject, setActiveProject } = useProjectsStore();
  const { activeUser } = useUsersStore();

  const onLogoClickHandler = () => {
    if (activeProject?._id) {
      navigate("project_overview");
    }
  };

  const onMyTaskClickHandler = () => {
    navigate("myTasks");
  };

  const onProjectsClickHandler = () => {
    navigate("allProjects");
  };

  const projectByUser = async () => {
    if (!activeUser) return;
    return await getProjectsByUser(activeUser);
  };

  const onSearchHandler = async (inputValue: string) => {
    const projects = await projectByUser();
    if (!projects) return;

    const currentFound = projects.find(
      (project) => project.name === inputValue
    );

    if (currentFound) {
      setActiveProject(currentFound);
      navigate("/project_overview");
    } else {
      Swal.fire({
        icon: "error",
        text: "No project with this name",
        timer: 750,
      });
    }
  };

  return (
    <div
      className={` flex bg-indigo-600 p-2 items-center justify-between sticky top-0 z-10   `}
    >
      <button
        onClick={onLogoClickHandler}
        className="border rounded-full w-12 h-12  text-center "
      >
        Logo
      </button>
      <button
        className="text-white hover:scale-105"
        onClick={onLogoClickHandler}
      >
        Home
      </button>

      <When condition={isLoggedIn}>
        <button
          className=" text-white hover:scale-105"
          onClick={onMyTaskClickHandler}
        >
          My Tasks
        </button>
        <button
          className=" text-white hover:scale-105"
          onClick={onProjectsClickHandler}
        >
          Projects
        </button>
      </When>

      <When condition={isLoggedIn}>
        <SearchBar onInput={onSearchHandler} />
        <ProfileModal logOut={onLogOutHandler} />
      </When>
    </div>
  );
};

export default Navbar;
