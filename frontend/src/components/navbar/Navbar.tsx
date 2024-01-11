import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppContext from "../../context/context";
import ProfileModal from "./profileModal/ProfileModal";
import SearchBar from "./searchBar/SearchBar";
// import logo from "../../logo.png";
import { getProjectsByUser } from "../../API/ProjectAPIcalls";
import classes from "./Navbar.module.css";
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
    <nav
      className={`navbar ${classes.navbar}`}
      role="navigation"
      aria-label="main navigation"
    >
      <div
        id="navbarBasicExample"
        className={`navbar-menu ${classes.logoContainer} flex gap-4`}
      >
        <img src={""} alt="Logo" />
        <div className="navbar-start">
          <a className="" onClick={onLogoClickHandler}>
            Home
          </a>

          <When condition={isLoggedIn}>
            <a className=" font-bold " onClick={onMyTaskClickHandler}>
              My Tasks
            </a>
            <a
              className="navbar-item has-text-white-ter"
              onClick={onProjectsClickHandler}
            >
              Projects
            </a>
          </When>
        </div>

        <div className="navbar-end">
          <When condition={isLoggedIn}>
            <div className="navbar-item has-text-white-ter">
              <SearchBar onInput={onSearchHandler} />
            </div>
            <div className="navbar-item has-text-white-ter">
              <ProfileModal logOut={onLogOutHandler} />
            </div>
          </When>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
