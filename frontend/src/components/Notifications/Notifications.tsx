import React, { SetStateAction, useState } from "react";
import ViewDataDialog from "../Tables/ViewDataDialog";
import { useUsersStore } from "@/store/usersStore";
import { userRequests } from "@/requests/UserRequests";

import { CommandItem } from "../ui/command";
import { Trash2Icon } from "lucide-react";
import { INotification } from "../../../../backend/src/interfaces";
import { When } from "react-if";
import { Notification } from "./Notification";

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
          deleteNotification={handleDeleteNotification}
          openModal={openNotification}
          setOpenModal={setOpenNotification}
          notification={notificationToView}
        />
      </When>
    </>
  );
};

export default Notifications;
