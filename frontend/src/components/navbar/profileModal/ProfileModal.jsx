import classes from "./ProfileModal.module.css";
import ProfilePage from "../../pages/profilePage/ProfilePage";
import logo from "../../../testProfile.jpg";
import { useState, useContext } from "react";
import Profile from "../../profile/Profile";
import AppContext from "../../../context/Context";

const ProfileModal = (props) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const context = useContext(AppContext);
  const email = context.userLogged.email;

  const profileClickHandler = () => {
    if (showProfileModal === true) {
      return;
    }
    if (!showProfileModal) {
      setShowProfileModal(() => true);
    }
  };

  const onCloseProfileHandler = () => {
    setShowProfileModal(false);
  };

  const logOut = () => {
    props.logOut();
  };

  return (
    <div>
      <div className={classes.profile}>
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
  );
};

export default ProfileModal;
