import React, { SetStateAction, useEffect, useState } from "react";
import { userRequests } from "@/requests/UserRequests";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { INotification } from "../../../../backend/src/interfaces";
import { IProject, IUser } from "@/interfaces";
import { projectRequests } from "@/requests/ProjectRequests";
import { When } from "react-if";
import { useToast } from "../ui/use-toast";
import { refreshData } from "@/requests/dataRefresher";
import { createNotification } from "./CreateNotification";
import { useUsersStore } from "@/store/usersStore";
import { NotificationType } from "@/enums/NotificationType";

interface NotificationProps {
  notification: INotification | null;
  deleteNotification: (id: string) => Promise<void>;
  openModal: boolean;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
}

export const Notification: React.FC<NotificationProps> = ({
  openModal,
  notification,
  deleteNotification,
  setOpenModal,
}) => {
  const [sender, setSender] = useState<IUser | null>(null);
  const [project, setProject] = useState<IProject | null>(null);

  const { activeUser } = useUsersStore();
  const { toast } = useToast();

  const getSender = async () => {
    if (!notification) return;
    await userRequests.getItemRequest(notification.from).then((user) => {
      setSender(user);
    });
  };

  const getProject = async () => {
    if (!notification) return;
    await projectRequests
      .getItemRequest(notification?.projectId)
      .then((project) => {
        console.log("project", project);
        setProject(project);
      });
  };

  const handleAcceptRequest = async () => {
    if (!notification) return;
    const user = await userRequests.getItemRequest(notification.from);
    const project = await projectRequests.getItemRequest(
      notification.projectId
    );

    if (!user || !project) {
      toast({
        title: "Something went wrong.",
        description: "Try again later.",
        variant: "destructive",
      });
      return;
    }

    const newNotification = createNotification(
      "Accepted to project",
      activeUser?._id!,
      project._id!,
      NotificationType.MESSAGE
    );

    user.notifications.push(newNotification);
    user.projects.push(project._id!);
    project.users.push(user);

    await projectRequests.editItemRequest(project);
    await userRequests.editItemRequest(user);
    await deleteNotification(notification._id);
    await refreshData();

    setOpenModal(false);
    toast({
      title: `${user.name} added to ${project.name}`,
      variant: "success",
      duration: 2000,
    });
  };

  const handleDeclineRequest = async () => {
    if (!notification) return;
    const user = await userRequests.getItemRequest(notification.from);
    console.log("from", user);
    const newNotification = createNotification(
      "Request Declined",
      activeUser?._id!,
      project?._id!,
      NotificationType.MESSAGE
    );

    user.notifications.push(newNotification);
    
    await userRequests.editItemRequest(user);
    await deleteNotification(notification._id);
    await refreshData();
    setOpenModal(false);
  };

  const initNotificationData = async () => {
    await getSender();
    await getProject();
  };

  useEffect(() => {
    initNotificationData();
  }, []);

  return (
    <When condition={project !== null && sender !== null}>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request to join project</DialogTitle>
            <DialogDescription>
              {`${sender?.name} would like to join "${project?.name}"  project?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className=" flex-center gap-1">
            <Button variant={"destructive"} onClick={handleDeclineRequest}>
              Decline
            </Button>
            <Button onClick={handleAcceptRequest}>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </When>
  );
};
