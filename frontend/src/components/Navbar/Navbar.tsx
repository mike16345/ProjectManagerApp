import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "../Profile/ProfileModal";
import SearchBar from "./SearchBar";
import { When } from "react-if";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";
import { projectRequests } from "@/requests/ProjectRequests";

const Navbar: React.FC = () => {
  const { activeProject, projects, setProjects } = useProjectsStore();
  const { activeUser } = useUsersStore();

  const navigate = useNavigate();

  const onLogoClickHandler = () => {
    if (activeProject?._id) {
      navigate("/home");
    }
  };

  const onSearchHandler = async (inputValue: string) => {
    const filteredProjects = inputValue.length
      ? projects.filter(
          (project) =>
            inputValue.length &&
            project.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      : [];

    if (filteredProjects.length) setProjects(filteredProjects);
    else await resetProjects();
    if (!window.location.href.includes("allProjects")) navigate("/allProjects");
  };

  const resetProjects = async () => {
    await projectRequests
      .getItemsRequest()
      .then((projects) => {
        setProjects(projects);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className=" bg-secondary text-primary px-3 py-2 z-10 sticky top-0 flex gap-4 flex-wrap md:justify-between items-center ">
      <h1
        className=" text-4xl cursor-pointer font-bold "
        onClick={onLogoClickHandler}
      >
        Synergize
      </h1>
      <Link to={"/"} className=" font-extrabold hover:scale-105">
        Home
      </Link>

      <Link
        to={"/project_overview"}
        className=" font-extrabold hover:scale-105"
      >
        Project Overview
      </Link>

      <Link to={"/myTasks"} className="  font-extrabold hover:scale-105">
        My Tasks
      </Link>
      <Link to={"/allProjects"} className="  font-extrabold hover:scale-105">
        Projects
      </Link>
      <When condition={activeUser?.isAdmin}>
        <Link
          to={"/admin"}
          className="  font-extrabold hover:scale-105"
          onClick={onLogoClickHandler}
        >
          Admin
        </Link>
      </When>
      <SearchBar onInput={onSearchHandler} />
      <ProfileModal />
    </div>
  );
};

export default Navbar;
