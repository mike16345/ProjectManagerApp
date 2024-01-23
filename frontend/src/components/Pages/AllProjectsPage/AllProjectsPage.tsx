import { useEffect, useState } from "react";
import { getProjectsByUser } from "../../../API/ProjectAPIcalls";
import ProjectPreviewBox from "./ProjectPreviewBox";
import { IProject } from "../../../interfaces";
import { When } from "react-if";
import { useUsersStore } from "../../../store/usersStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useProjectsStore } from "../../../store/projectsStore";

const AllProjectPage = () => {
  const { activeUser } = useUsersStore();
  const { projects } = useProjectsStore();
  const [myProjects, setMyProjects] = useState<IProject[]>([]);
  const navigate = useNavigate();

  const fetchUsersProject = async () => {
    if (!activeUser) return;
    const projects = await getProjectsByUser(activeUser);
    setMyProjects(projects);
  };

  const handleAddNewProject = () => {
    navigate("/createProject");
  };

  useEffect(() => {
    fetchUsersProject();
  }, []);

  return (
    <div className="  flex flex-col gap-6 m-8 ">
      <When condition={activeUser && activeUser.isAdmin}>
        <Button
          colorScheme="purple"
          className=" border rounded-lg p-2   font-extrabold hover:scale-105 w-32 h-12 "
          onClick={handleAddNewProject}
        >
          Add project
        </Button>
      </When>

      <When condition={activeUser && activeUser.projects.length > 0}>
        <div className="w-full h-full ">
          <div className=" text-2xl font-bold ">My Projects:</div>
          <div className=" border border-black rounded  p-2 flex gap-2 bg-indigo-100">
            {myProjects.map((project, index) => (
              <ProjectPreviewBox key={index} project={project} />
            ))}
          </div>
        </div>
      </When>
      <div>
        <h2 className="">All projects:</h2>
        <div className=" flex gap-2 ">
          {projects.map((project, index) => (
            <ProjectPreviewBox key={index} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProjectPage;
