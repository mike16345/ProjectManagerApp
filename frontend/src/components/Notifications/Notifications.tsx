import React, { SetStateAction, useState } from "react";
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
  return (
    <div>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request to join project</DialogTitle>
            <DialogDescription>
              {`Would you like to add "${notification}" to the project?`}
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
    </div>
  );
};

interface INotifications {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const Notifications: React.FC<INotifications> = ({ open, setOpen }) => {
  const { activeUser } = useUsersStore();

  const [openNotification, setOpenNotification] = useState(false);
  const [notificationToView, setNotificationToView] =
    useState<INotification | null>(null);

  const handleDeleteNotification = async (id: string) => {
    if (!activeUser) return;

    const filteredNotifications = activeUser?.notifications.filter(
      (noti) => noti._id !== id
    );

    activeUser.notifications = filteredNotifications;
    await userRequests.editItemRequest(activeUser);
  };

  const renderNotification = (item: INotification, index: number) => {
    return (
      <CommandItem className="flex items-center justify-between" key={index}>
        <span
          onClick={() => {
            setOpenNotification(true);
            setNotificationToView(item);
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
      <Notification
        openModal={openNotification}
        setOpenModal={setOpenNotification}
        notification={notificationToView}
      />
    </>
  );
};

export default Notifications;
