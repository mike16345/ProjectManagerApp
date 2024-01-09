import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppContext from "../../context/context";
import ProfileModal from "./profileModal/ProfileModal";
import SearchBar from "./searchBar/SearchBar";
// import logo from "../../logo.png";
import { getProjectsByUser } from "../../API/ProjectAPIcalls";
import classes from "./Navbar.module.css";

const Navbar = (props) => {
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
    return await getProjectsByUser(context.userLogged);
  };

  const onSearchHandler = async (inputValue) => {
    const projects = await projectByUser();
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

  const logOut = () => {
    props.logOut();
  };

  return (
    <nav
      className={`navbar ${classes.navbar}`}
      role="navigation"
      aria-label="main navigation"
    >
      <div
        id="navbarBasicExample"
        className={`navbar-menu ${classes.logoContainer}`}
      >
        <img src={""} alt="Logo" />
        <div className="navbar-start">
          <a
            className="navbar-item has-text-white-ter"
            onClick={onLogoClickHandler}
          >
            Home
          </a>

          {props.loggedIn && (
            <a
              className="navbar-item has-text-white-ter"
              onClick={onMyTaskClickHandler}
            >
              My Tasks
            </a>
          )}
          {props.loggedIn && (
            <a
              className="navbar-item has-text-white-ter"
              onClick={onProjectsClickHandler}
            >
              Projects
            </a>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item has-text-white-ter">
            {props.loggedIn && <SearchBar onInput={onSearchHandler} />}
          </div>
          <div className="navbar-item has-text-white-ter">
            {props.loggedIn && (
              <ProfileModal logOut={logOut}>Profile</ProfileModal>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
