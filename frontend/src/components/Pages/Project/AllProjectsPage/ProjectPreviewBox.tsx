import { useNavigate } from "react-router-dom";
import { IProject } from "../../../../interfaces";
import { useProjectsStore } from "../../../../store/projectsStore";
import { Button } from "@/components/ui/button";
import { Else, If, Then, When } from "react-if";
import { useUsersStore } from "@/store/usersStore";
import secureLocalStorage from "react-secure-storage";
import { projectRequests } from "@/requests/ProjectRequests";
import { useToast } from "@/components/ui/use-toast";
import { userRequests } from "@/requests/UserRequests";
import { taskRequests } from "@/requests/TaskRequests";
import { refreshData } from "@/requests/dataRefresher";
import { INotification } from "../../../../../../backend/src/interfaces";

interface IProjectPreviewBox {
  isMyProject: boolean;
  project: IProject;
  className?: string;
}
const ProjectPreviewBox: React.FC<IProjectPreviewBox> = ({
  project,
  isMyProject,
  className,
}) => {
  const navigate = useNavigate();
  const { setActiveProject, deleteProject } = useProjectsStore();
  const { activeUser } = useUsersStore();
  const { toast } = useToast();

  const onProjectClickHandler = () => {
    setActiveProject(project);
    secureLocalStorage.setItem("active-project", JSON.stringify(project));
    navigate("/project_overview");
  };

  const handleDeleteProject = async () => {
    await deleteProject(project)
      .then(() => {
        toast({
          title: "Project deleted",
          description: "Successfully deleted project!",
          duration: 2000,
          variant: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Could not delete project",
          description: "There was an error deleting project",
          duration: 2000,
          variant: "destructive",
        });
      });
  };

  const handleLeaveProject = async () => {
    if (!activeUser) return;

    activeUser.projects = activeUser?.projects.filter((projectId) => {
      return projectId !== project._id;
    });

    await userRequests.editItemRequest(activeUser);
    await projectRequests.removeUserFromProject(activeUser._id, project._id!);
    await taskRequests.removeAssignedUserFromTasks(
      activeUser._id,
      project._id!
    );
    await refreshData();
  };

  const handleRequestToJoinProject = async () => {
    if (!activeUser) return;
    const projectLead = project.projectLead;

    const notification: INotification = {
      title: "Request to join project",
      from: activeUser._id,
      type: "request",
      projectId: project._id!,
      isNew: true,
      date_created: new Date(),
    };
    projectLead.notifications.push(notification);
    await userRequests.editItemRequest(projectLead);
  };

  return (
    <div
      onClick={onProjectClickHandler}
      className={`flex flex-col border-2 hover:shadow-lg rounded p-2 gap-10 w-52  cursor-pointer  `}
    >
      <div className="flex flex-col items-start gap-0">
        <span className="font-semibold text-lg">{project.name}</span>
        <span className="text-sm">{project.date_created?.slice(0, 10)!}</span>
      </div>
      <If condition={!isMyProject}>
        <Then>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRequestToJoinProject();
            }}
            size={"sm"}
          >
            Request to join
          </Button>
        </Then>
        <Else>
          <div className="flex items-center gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleLeaveProject();
              }}
              size={"sm"}
            >
              Leave Project
            </Button>
            <When
              condition={
                activeUser && activeUser._id == project.projectLead._id
              }
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject();
                }}
                variant={"destructive"}
                className="flex-grow"
                size={"sm"}
              >
                Delete
              </Button>
            </When>
          </div>
        </Else>
      </If>
    </div>
  );
};

export default ProjectPreviewBox;
