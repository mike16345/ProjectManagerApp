import React, { useState } from "react";
import ProfilePage from "../Profile/ProfilePage";
import { Profile } from "../Profile/Profile";
import { When } from "react-if";
import { useUsersStore } from "../../store/usersStore";

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
    <div>
      <Profile onClick={profileClickHandler} name={activeUser?.email || ""} />
      <When condition={showProfileModal}>
        <ProfilePage logOut={logOut} onCloseProfile={onCloseProfileHandler} />
      </When>
    </div>
  );
};

export default ProfileModal;
