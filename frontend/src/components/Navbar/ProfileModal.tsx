import React, { useState } from "react";
import { Profile } from "../Profile/Profile";
import { useUsersStore } from "../../store/usersStore";
import { Box, useToast } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/theme/mode-toggle";
import secureLocalStorage from "react-secure-storage";
import useAuth from "@/Authentication/useAuth";

const ProfileModal: React.FC = () => {
  const { activeUser } = useUsersStore();
  const { logout } = useAuth();
  const toast = useToast();

  const onLogOutHandler = () => {
    secureLocalStorage.removeItem("user-token");
    logout();
    toast({
      title: "Successfully Logged Out",
      description: "You have successfully logged out",
      status: "success",
      position: "top-right",
    });
  };

  return (
    <Box>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <Profile
              // onClick={profileClickHandler}
              user={activeUser ? activeUser : undefined}
            />
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
              <span className="rounded bg-red-500 w-5 h-5 text-center text-black">
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
    </Box>
  );
};

export default ProfileModal;
