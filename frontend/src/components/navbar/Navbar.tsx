import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProfileModal from "./ProfileModal";
import SearchBar from "./SearchBar";
import { getProjectsByUser } from "../../API/ProjectAPIcalls";
import { When } from "react-if";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";
import { Button, Flex, Heading } from "@chakra-ui/react";

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
      </When>

      <When condition={isLoggedIn}>
        <SearchBar onInput={onSearchHandler} />
        <ProfileModal logOut={onLogOutHandler} />
      </When>
    </Flex>
  );
};

export default Navbar;
