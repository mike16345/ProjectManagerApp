import { useEffect, useState } from "react";
import { getProjectsByUser } from "../../../../API/ProjectAPIcalls";
import ProjectPreviewBox from "./ProjectPreviewBox";
import { IProject } from "../../../../interfaces";
import { When } from "react-if";
import { useUsersStore } from "../../../../store/usersStore";
import { useNavigate } from "react-router-dom";
import { useProjectsStore } from "../../../../store/projectsStore";
import { Button } from "@/components/ui/button";

const AllProjectPage = () => {
  const navigate = useNavigate();
  const { activeUser } = useUsersStore();
  const { projects } = useProjectsStore();
  const [myProjects, setMyProjects] = useState<IProject[]>([]);

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
      <When condition={activeUser !== null}>
        <Button
          className=" font-extrabold hover:scale-105 w-32 h-12 "
          onClick={handleAddNewProject}
        >
          Add project
        </Button>
      </When>

      <When condition={activeUser && activeUser.projects.length > 0}>
        <div className="w-full h-full ">
          <div className=" text-2xl font-bold ">My Projects:</div>
          <div className=" border  rounded  p-2 flex flex-wrap gap-2">
            {myProjects.map((project, index) => (
              <ProjectPreviewBox
                key={index}
                project={project}
                isMyProject={true}
              />
            ))}
          </div>
        </div>
      </When>
      <div>
        <div className=" text-2xl font-bold ">All Projects:</div>
        <div className=" border  rounded  p-2 flex flex-wrap gap-2">
          {projects.map((project, index) => (
            <ProjectPreviewBox
              key={index}
              project={project}
              isMyProject={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProjectPage;
