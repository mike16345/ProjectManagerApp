import { useNavigate } from "react-router-dom";
import { IProject } from "../../../../interfaces";
import { useProjectsStore } from "../../../../store/projectsStore";
import { Button } from "@/components/ui/button";
import { Else, If, Then, When } from "react-if";
import { useUsersStore } from "@/store/usersStore";
import { projectRequests } from "@/requests/ProjectRequests";
import { useToast } from "@/components/ui/use-toast";
import { userRequests } from "@/requests/UserRequests";
import { taskRequests } from "@/requests/TaskRequests";
import { refreshData } from "@/requests/dataRefresher";
import { INotification } from "../../../../../../backend/src/interfaces";
import { createNotification } from "@/components/Notifications/CreateNotification";

import { useEffect, useState } from "react";

interface IProjectPreviewBox {
  isMyProject: boolean;
  project: IProject;
}

const ProjectPreviewBox: React.FC<IProjectPreviewBox> = ({
  project,
  isMyProject,
}) => {
  const navigate = useNavigate();
  const { setActiveProject, deleteProject } = useProjectsStore();
  const { activeUser, setActiveUser } = useUsersStore();
  const { toast } = useToast();

  const didRequestTojoin = async () => {
    if (!project.projectLead) return false;

    await userRequests.getItemRequest(project.projectLead._id).then((user) => {
      const foundRequest = user.notifications.find(
        (notification) =>
          notification.from === activeUser?._id &&
          notification.projectId === project._id
      );

      if (foundRequest) {
        setRequestedToJoin(true);
      } else {
        setRequestedToJoin(false);
      }
    });
  };

  const [requestedToJoin, setRequestedToJoin] = useState(false);

  useEffect(() => {
    didRequestTojoin();
  }, []);

  const onProjectClickHandler = () => {
    setActiveProject(project);
    sessionStorage.setItem("active-project", JSON.stringify(project));
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
    const projectToLeave = await projectRequests.getItemRequest(project._id!);

    if (project.projectLead && activeUser._id === project.projectLead._id) {
      // setOpenModal(true);
      projectToLeave.projectLead = null;
    }

    activeUser.projects = activeUser?.projects.filter((projectId) => {
      return projectId !== project._id;
    });

    await userRequests.editItemRequest(activeUser);
    await projectRequests.editItemRequest(projectToLeave);
    await projectRequests.removeUserFromProject(activeUser._id, project._id!);
    await taskRequests.removeAssignedUserFromTasks(
      activeUser._id,
      project._id!
    );
    await refreshData();
    console.log("project lead", projectToLeave);
    console.log("active user", activeUser);
  };

  const handleRequestToJoinProject = async () => {
    if (!activeUser) return;
    const projectLeadId = project.projectLead && project.projectLead._id;

    const projectLead = await userRequests.getItemRequest(projectLeadId || "");

    if (!projectLead) {
      activeUser.projects.push(project._id!);
      project.projectLead = activeUser;
      const exists = project.users.find((user) => user._id === activeUser._id);
      if (!exists) {
        project.users.push(activeUser);
      }
      await userRequests.editItemRequest(activeUser).then((user) => {
        setActiveUser(user);
      });
      await projectRequests.editItemRequest(project);
      toast({
        title: "There was no project lead!",
        description: "You are the new project lead!",
        duration: 2000,
        variant: "success",
      });
    }

    const notification: INotification = createNotification(
      "Request to join project",
      activeUser._id,
      project._id!,
      "request"
    );

    projectLead.notifications.push(notification);
    const res = await userRequests.editItemRequest(projectLead);
    console.log(res);
    await refreshData();
    await didRequestTojoin();

    toast({
      title: "Sent request to project leader.",
      description: `Successfully requested to join ${project.name}`,
      variant: "success",
    });
  };

  const handleTakeOwnership = async () => {
    if (!activeUser) return;
    activeUser.projects.push(project._id!);
    project.projectLead = activeUser;
    const exists = project.users.find((user) => user._id === activeUser._id);
    if (!exists) {
      project.users.push(activeUser);
    }
    await userRequests.editItemRequest(activeUser);
    await projectRequests.editItemRequest(project);
    await refreshData();
    console.log(project);
    console.log(activeUser);
  };

  const getButtonText = () => {
    if (project.projectLead) {
      console.log("requested to join", requestedToJoin);
      if (requestedToJoin) return "Requested";
      else return "Request to join";
    }

    return "Take ownership";
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
            disabled={requestedToJoin}
            onClick={(e) => {
              e.stopPropagation();
              if (project.projectLead) handleRequestToJoinProject();
              else handleTakeOwnership();
            }}
            size={"sm"}
          >
            {getButtonText()}
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
                activeUser &&
                project.projectLead &&
                activeUser._id == project.projectLead._id
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
      {/* <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request to join project</DialogTitle>
            <DialogDescription>
              {`${sender?.name} would like to join "${project?.name}"  project?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className=" flex-center gap-1">
            <Button
              variant={"destructive"}
              onClick={() => setOpenModal(false)}
              type="submit"
            >
              Decline
            </Button>
            <Button onClick={() => console.log("add user")}>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default ProjectPreviewBox;
