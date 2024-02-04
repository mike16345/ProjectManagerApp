import React, { useState } from "react";
import { Profile } from "./Profile";
import { useUsersStore } from "../../store/usersStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/theme/mode-toggle";
import useAuth from "@/Authentication/useAuth";
import { useToast } from "../ui/use-toast";
import Notifications from "../Notifications/Notifications";

const ProfileModal: React.FC = () => {
  const { activeUser } = useUsersStore();
  const [openNotifications, setOpenNotifications] = useState(false);

  const { logout } = useAuth();
  const { toast } = useToast();

  const onLogOutHandler = () => {
    logout();
    toast({
      title: "Successfully Logged Out",
      description: "You have successfully logged out",
      variant: "success",
    });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className=" flex-center">
            <Profile user={activeUser ? activeUser : undefined} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="flex flex-col justify-center gap-1">
            <div className="text-primary">My Account</div>
            <div className=" text-muted-foreground">{activeUser?.email}</div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className=" cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpenNotifications(true)}
              className="flex hover:bg-current items-center cursor-pointer justify-between "
            >
              Notifications
              <span className="rounded bg-destructive w-5 h-5 text-center text-primary">
                {activeUser?.notifications.length}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <div className="flex items-center  justify-between ">
              <span className="ml-2 text-sm">Theme</span>
              <ModeToggle />
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogOutHandler}
            className="cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Notifications open={openNotifications} setOpen={setOpenNotifications} />
    </div>
  );
};

export default ProfileModal;
