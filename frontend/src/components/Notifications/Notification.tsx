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

  const { activeUser, setActiveUser } = useUsersStore();
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
      `${activeUser?.name} has accepted your request to join ${project.name}`,
      activeUser?._id!,
      project._id!,
      NotificationType.ACCEPTED
    );

    user.notifications.push(newNotification);
    user.projects.push(project._id!);
    project.users.push(user);

    await projectRequests.editItemRequest(project);
    await userRequests.editItemRequest(user);
    await deleteNotification(notification._id);
    await refreshData();
    await userRequests
      .getItemRequest(activeUser?._id || "")
      .then((user) => {
        setActiveUser(user);
      })
      .catch((err) => {
        console.log("error finding user", err);
      });

    setOpenModal(false);
    toast({
      title: `Added ${user.name} to ${project.name}`,
      variant: "success",
      duration: 2000,
    });
  };

  const handleDeclineRequest = async () => {
    if (!notification) return;
    const user = await userRequests.getItemRequest(notification.from);

    const newNotification = createNotification(
      `Your request to join ${project?.name} has been declined.`,
      activeUser?._id!,
      project?._id!,
      NotificationType.DECLINED
    );

    user.notifications.push(newNotification);

    await userRequests.editItemRequest(user);
    await deleteNotification(notification._id);
    await refreshData();
    await userRequests
      .getItemRequest(activeUser?._id || "")
      .then((user) => {
        setActiveUser(user);
      })
      .catch((err) => {
        console.log("error finding user", err);
      });
    setOpenModal(false);
  };

  const initNotificationData = async () => {
    await getSender();
    await getProject();
  };

  const getNotificationDialog = () => {
    if (!notification) return;

    switch (notification.type) {
      case NotificationType.MESSAGE:
        return notification.title;
      case NotificationType.REQUESTED:
        return `${sender?.name} has requested to join "${project?.name}" project.`;
      case NotificationType.INVITED:
        return `${sender?.name} has invited you to join "${project?.name}"!`;
      case NotificationType.ACCEPTED:
        return `${sender?.name} has accepted your request to join "${project?.name}" project!`;
      case NotificationType.DECLINED:
        return `${sender?.name} has declined your request to join "${project?.name}" project!`;
    }
  };

  useEffect(() => {
    initNotificationData();
  }, []);

  return (
    <When condition={project !== null && sender !== null}>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{notification?.title}</DialogTitle>
            <DialogDescription>{getNotificationDialog()}</DialogDescription>
          </DialogHeader>
          <DialogFooter className=" flex-center gap-1">
            <When
              condition={
                notification !== null &&
                (notification.type == NotificationType.REQUESTED ||
                  notification.type == NotificationType.INVITED)
              }
            >
              <Button variant={"destructive"} onClick={handleDeclineRequest}>
                Decline
              </Button>
              <Button onClick={handleAcceptRequest}>Accept</Button>
            </When>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </When>
  );
};
