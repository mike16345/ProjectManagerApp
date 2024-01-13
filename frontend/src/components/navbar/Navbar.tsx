import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppContext from "../../context/context";
import ProfileModal from "./ProfileModal";
import SearchBar from "./SearchBar";
// import logo from "../../logo.png";
import { getProjectsByUser } from "../../API/ProjectAPIcalls";
import { When } from "react-if";

interface INavbar {
  isLoggedIn: boolean;
  onLogOutHandler: () => void;
}
const Navbar: React.FC<INavbar> = ({ isLoggedIn, onLogOutHandler }) => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  const onLogoClickHandler = () => {
    if (context.currentProject?._id) {
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
    if (!context.userLogged) return;
    return await getProjectsByUser(context.userLogged);
  };

  const onSearchHandler = async (inputValue: string) => {
    const projects = await projectByUser();
    if (!projects) return;
    // Find project
    const currentFound = projects.find(
      (project) => project.name === inputValue
    );
    context.currentProject = currentFound ? currentFound : null;

    if (context.currentProject) {
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
    <div className={` flex bg-indigo-600 p-2  items-center justify-between   `}>
      <button className="border rounded-full w-14 h-14 text-center ">
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
