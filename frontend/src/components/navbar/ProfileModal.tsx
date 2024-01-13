import React, { useState, useContext } from "react";
import ProfilePage from "../profile/ProfilePage";
import Profile from "../profile/Profile";
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
    <>
      <div>
        <div className="">
          <Profile
            onClick={profileClickHandler}
            name={activeUser?.email || ""}
          />
        </div>
        <When condition={showProfileModal}>
          <ProfilePage logOut={logOut} onCloseProfile={onCloseProfileHandler} />
        </When>
      </div>
    </>
  );
};

export default ProfileModal;
