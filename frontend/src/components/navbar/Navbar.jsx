import { useContext } from "react";
import AppContext from "../../context/Context";
import ProfileModal from "./profileModal/ProfileModal";
import classes from "./Navbar.module.css";
import logo from "../../logo.png";
import SearchBar from "./searchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import { getProjectsByUser } from "../../API/ProjectAPIcalls";
import Swal from "sweetalert2";

// gets props from app
const Navbar = (props) => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const currentProject = context.currentProject;

  const onLogoClickHandler = () => {
    if (currentProject._id) {
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
        text: "no project with this name",
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
        <img src={logo} />
        <div className="navbar-start">
          <a
            className="navbar-item has-text-white-ter	"
            onClick={onLogoClickHandler}
          >
            Home
          </a>

          {props.loggedIn && (
            <a
              className="navbar-item has-text-white-ter	"
              onClick={onMyTaskClickHandler}
            >
              My Tasks
            </a>
          )}
          {props.loggedIn && (
            <a
              className="navbar-item has-text-white-ter	"
              onClick={onProjectsClickHandler}
            >
              Projects
            </a>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item has-text-white-ter	">
            {props.loggedIn && <SearchBar onInput={onSearchHandler} />}
          </div>
          <div className="navbar-item has-text-white-ter	">
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
