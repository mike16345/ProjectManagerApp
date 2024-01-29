import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import SearchBar from "./SearchBar";
import { When } from "react-if";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";
import { useToast } from "../ui/use-toast";

const Navbar: React.FC = () => {
  const { activeProject, projects, setActiveProject } = useProjectsStore();
  const { activeUser } = useUsersStore();

  const { toast } = useToast();
  const navigate = useNavigate();

  const onLogoClickHandler = () => {
    if (activeProject?._id) {
      navigate("project_overview");
    }
  };

  const onSearchHandler = async (inputValue: string) => {
    const currentFound = projects.find(
      (project) => project.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (currentFound) {
      setActiveProject(currentFound);
      navigate("/project_overview");
    } else {
      toast({
        title: "Project not found",
        description: "Could not find project with that name",
        variant: "destructive",
      });
    }
  };

  return (
    <div className=" bg-secondary text-primary p-3 z-10 sticky top-0 flex items-center justify-between">
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
