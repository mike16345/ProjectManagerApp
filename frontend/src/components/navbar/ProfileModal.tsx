import React, { useState } from "react";
import ProfilePage from "../Profile/ProfilePage";
import { Profile } from "../Profile/Profile";
import { When } from "react-if";
import { useUsersStore } from "../../store/usersStore";
import { Box, useToast } from "@chakra-ui/react";

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
      <Profile onClick={profileClickHandler} name={activeUser?.email || ""} />
      <When condition={showProfileModal}>
        <ProfilePage logOut={logOut} onCloseProfile={onCloseProfileHandler} />
      </When>
    </Box>
  );
};

export default ProfileModal;
