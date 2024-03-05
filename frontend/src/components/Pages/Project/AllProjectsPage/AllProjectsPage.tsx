import { useEffect, useMemo, useState } from "react";
import ProjectPreviewBox from "./ProjectPreviewBox";
import { IProject } from "../../../../interfaces";
import { When } from "react-if";
import { useUsersStore } from "../../../../store/usersStore";
import { useNavigate } from "react-router-dom";
import { useProjectsStore } from "../../../../store/projectsStore";
import { Button } from "@/components/ui/button";
import { BY_USER_ENDPOINT, projectRequests } from "@/requests/ProjectRequests";
import { Separator } from "@/components/ui/separator";

const AllProjectPage = () => {
  const navigate = useNavigate();
  const { activeUser } = useUsersStore();
  const { projects } = useProjectsStore();
  const [myProjects, setMyProjects] = useState<IProject[]>([]);

  const fetchUsersProject = async () => {
    if (!activeUser) return;

    const myProjects = await projectRequests.getItemsByRequest(
      activeUser._id,
      BY_USER_ENDPOINT
    );

    const filteredProjects = myProjects.filter((project) =>
      projects.some((proj) => proj._id === project._id)
    );

    setMyProjects(filteredProjects);
  };

  const handleAddNewProject = () => {
    navigate("/createProject");
  };

  useEffect(() => {
    fetchUsersProject();
  }, [projects]);

  return (
    <div className="  flex flex-col gap-3 m-6 ">
      <div className="flex items-center justify-between">
        <div className=" text-4xl font-bold ">Projects</div>

        <When condition={activeUser !== null}>
          <Button
            className=" font-black hover:scale-105 w-32 h-10 "
            onClick={handleAddNewProject}
          >
            Create Project
          </Button>
        </When>
      </div>

      <When condition={activeUser && activeUser.projects.length > 0}>
        <div className="w-full h-full">
          <div className=" text-lg mb-2 font-semibold ">My Projects:</div>
          <div className=" flex flex-wrap  gap-4 max-h-[60vh] overflow-y-auto ">
            {myProjects.map((project, index) => (
              <ProjectPreviewBox
                key={index}
                project={project}
                isMyProject={true}
              />
            ))}
          </div>
        </div>
        <Separator />
      </When>
      <div>
        <div className=" text-2xl mb-2 font-bold ">All Projects:</div>
        <div className="  max-h-[60vh] overflow-y-auto   flex flex-wrap gap-4">
          {projects.map((project, index) => (
            <ProjectPreviewBox
              key={index}
              project={project}
              isMyProject={
                activeUser?.projects.find(
                  (project_id) => project._id === project_id
                ) !== undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProjectPage;
