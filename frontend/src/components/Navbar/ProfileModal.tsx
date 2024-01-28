import React, { useState } from "react";
import ProfilePage from "../Profile/ProfilePage";
import { Profile } from "../Profile/Profile";
import { When } from "react-if";
import { useUsersStore } from "../../store/usersStore";
import { Box } from "@chakra-ui/react";
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

interface ProfileModalProps {
  logOut: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ logOut }) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const { activeUser } = useUsersStore();

  const profileClickHandler = () => {
    setShowProfileModal((show) => !show);
  };

  const onCloseProfileHandler = () => {
    setShowProfileModal(false);
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
            <DropdownMenuItem className="flex items-center cursor-pointer justify-between ">
              Notifications
              <span className="rounded bg-red-500 w-5 h-5 text-center text-black">
                5
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logOut} className="cursor-pointer">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};

export default ProfileModal;
