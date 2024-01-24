import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import SearchBar from "./SearchBar";
import { getProjectsByUser } from "../../API/ProjectAPIcalls";
import { When } from "react-if";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";
import { Button, Flex, Heading, useToast } from "@chakra-ui/react";

interface INavbar {
  isLoggedIn: boolean;
  onLogOutHandler: () => void;
}
const Navbar: React.FC<INavbar> = ({ isLoggedIn, onLogOutHandler }) => {
  const { activeProject, projects, setActiveProject } = useProjectsStore();
  const { activeUser } = useUsersStore();

  const toast = useToast();
  const navigate = useNavigate();

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

  const onAdminClickHandler = () => {
    navigate("/admin");
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
    <Flex
      bg={"purple.600"}
      p={2}
      justifyContent={"space-between"}
      alignItems={"center"}
      pos={"sticky"}
      zIndex={10}
      top={0}
    >
      <Heading
        cursor={"pointer"}
        onClick={onLogoClickHandler}
        color="purple.50"
        as={"h4"}
      >
        Synergize
      </Heading>
      <Button
        colorScheme="white"
        className=" hover:scale-105"
        onClick={onLogoClickHandler}
      >
        Home
      </Button>

      <When condition={isLoggedIn}>
        <Button
          colorScheme="white"
          className=" hover:scale-105"
          onClick={onMyTaskClickHandler}
        >
          My Tasks
        </Button>
        <Button
          colorScheme="white"
          className=" hover:scale-105"
          onClick={onProjectsClickHandler}
        >
          Projects
        </Button>
        <When condition={activeUser?.isAdmin}>
          <Button
            colorScheme="white"
            className=" hover:scale-105"
            onClick={onAdminClickHandler}
          >
            Admin
          </Button>
        </When>
      </When>

      <When condition={isLoggedIn}>
        <SearchBar onInput={onSearchHandler} />
        <ProfileModal logOut={onLogOutHandler} />
      </When>
    </Flex>
  );
};

export default Navbar;
