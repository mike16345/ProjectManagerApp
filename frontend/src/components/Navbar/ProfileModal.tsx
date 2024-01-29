import React from "react";
import { Profile } from "../Profile/Profile";
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
import secureLocalStorage from "react-secure-storage";
import useAuth from "@/Authentication/useAuth";
import { useToast } from "../ui/use-toast";

const ProfileModal: React.FC = () => {
  const { activeUser } = useUsersStore();
  const { logout } = useAuth();
  const { toast } = useToast();

  const onLogOutHandler = () => {
    secureLocalStorage.removeItem("user-token");
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
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className=" cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex hover:bg-current items-center cursor-pointer justify-between ">
              Notifications
              <span className="rounded bg-destructive w-5 h-5 text-center text-primary">
                5
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <ModeToggle />
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
    </div>
  );
};

export default ProfileModal;
