import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import SearchBar from "./SearchBar";
import { getProjectsByUser } from "../../API/ProjectAPIcalls";
import { When } from "react-if";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";
import { Button, Flex, Heading, useToast } from "@chakra-ui/react";

const Navbar: React.FC = () => {
  const { activeProject, projects, setActiveProject } = useProjectsStore();
  const { activeUser } = useUsersStore();

  const toast = useToast();
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
        position: "top-right",
        description: "Could not find project with that name",
        status: "error",
      });
    }
  };

  return (
    <div className=" bg-primary p-3 z-10 sticky top-0 flex items-center justify-between">
      <h1
        className=" text-4xl cursor-pointer font-bold text-secondary "
        onClick={onLogoClickHandler}
      >
        Synergize
      </h1>
      <Link
        to={"/project_overview"}
        className=" text-secondary font-extrabold hover:scale-105"
      >
        Home
      </Link>

      <Link
        to={"/myTasks"}
        className=" text-secondary font-extrabold hover:scale-105"
      >
        My Tasks
      </Link>
      <Link
        to={"/allProjects"}
        className=" text-secondary font-extrabold hover:scale-105"
      >
        Projects
      </Link>
      <When condition={activeUser?.isAdmin}>
        <Link
          to={"/admin"}
          className=" text-secondary font-extrabold hover:scale-105"
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
