import React, { useState, useContext } from "react";
import ProfilePage from "../../pages/profilePage/ProfilePage";
// import logo from "../../../testProfile.jpg";
import Profile from "../../profile/Profile";
import AppContext from "../../../context/context";

interface ProfileModalProps {
  logOut: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = (
  props: ProfileModalProps
) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const context = useContext(AppContext);
  const email = context.userLogged.email;

  const profileClickHandler = () => {
    if (showProfileModal) {
      return;
    }
    setShowProfileModal(true);
  };

  const onCloseProfileHandler = () => {
    setShowProfileModal(false);
  };

  const logOut = () => {
    props.logOut();
  };

  return (
    <>
      <div>
        <div className="profile">
          <Profile onClick={profileClickHandler} name={email} />
        </div>
        {showProfileModal && (
          <ProfilePage
            logOut={logOut}
            onCloseProfile={onCloseProfileHandler}
            imageSrc={logo}
          />
        )}
      </div>
    </>
  );
};

export default ProfileModal;
