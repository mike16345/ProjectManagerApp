import React, { SetStateAction, useEffect, useState } from "react";
import ViewDataDialog from "../Tables/ViewDataDialog";
import { useUsersStore } from "@/store/usersStore";
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
import { CommandItem } from "../ui/command";
import { Trash2Icon } from "lucide-react";
import { INotification } from "../../../../backend/src/interfaces";
import { IProject, IUser } from "@/interfaces";
import { projectRequests } from "@/requests/ProjectRequests";
import { When } from "react-if";

interface NotificationProps {
  notification: INotification | null;
  openModal: boolean;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
}

const Notification: React.FC<NotificationProps> = ({
  openModal,
  notification,
  setOpenModal,
}) => {
  const [sender, setSender] = useState<IUser | null>(null);
  const [project, setProject] = useState<IProject | null>(null);

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
      </Dialog>
    </When>
  );
};

interface INotifications {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const Notifications: React.FC<INotifications> = ({ open, setOpen }) => {
  const { activeUser, setActiveUser } = useUsersStore();

  const [openNotification, setOpenNotification] = useState(false);
  const [notificationToView, setNotificationToView] =
    useState<INotification | null>(null);

  const handleDeleteNotification = async (id: string) => {
    if (!activeUser) return;

    const filteredNotifications = activeUser?.notifications.filter(
      (noti) => noti._id !== id
    );

    activeUser.notifications = filteredNotifications;
    await userRequests.editItemRequest(activeUser).then((user) => {
      setActiveUser(user);
    });
  };

  const renderNotification = (item: INotification, index: number) => {
    return (
      <CommandItem className="flex items-center justify-between" key={index}>
        <span
          onClick={() => {
            setOpenNotification(true);
            setNotificationToView(item);
            item.isNew = false;
          }}
          className="text-sm font-semibold  hover:underline cursor-pointer"
        >
          {item.title}
        </span>
        <Trash2Icon
          className="cursor-pointer"
          onClick={() => handleDeleteNotification(item._id!)}
        />
      </CommandItem>
    );
  };

  return (
    <>
      <ViewDataDialog
        data={activeUser?.notifications || []}
        renderItem={renderNotification}
        open={open}
        setOpen={setOpen}
      />
      <When condition={openNotification}>
        <Notification
          openModal={openNotification}
          setOpenModal={setOpenNotification}
          notification={notificationToView}
        />
      </When>
    </>
  );
};

export default Notifications;
