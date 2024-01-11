import React from "react";
import classes from "./ProfilePage.module.css";

interface ProfilePageWrapProps {
  onCloseProfile: () => void;
  children: React.ReactNode;
}

const ProfilePageWrap: React.FC<ProfilePageWrapProps> = ({
  onCloseProfile,
  children,
}) => {
  return (
    <div>
      <div className={classes.overlay} onClick={onCloseProfile}></div>
      <div className={classes.pointer}></div>
      <div className={classes.wrapBox}>{children}</div>
    </div>
  );
};

export default ProfilePageWrap;
