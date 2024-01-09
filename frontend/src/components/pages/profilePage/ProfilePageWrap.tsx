import React from "react";
import classes from "./ProfilePage.module.css";

interface ProfilePageWrapProps {
  onCloseProfile: () => void;
}

const ProfilePageWrap: React.FC<ProfilePageWrapProps> = (
  props: ProfilePageWrapProps
) => {
  const handler = () => {
    props.onCloseProfile();
  };

  return (
    <div>
      <div className={classes.overlay} onClick={handler}></div>
      <div className={classes.pointer}></div>
      <div className={classes.wrapBox}>{props.children}</div>
    </div>
  );
};

export default ProfilePageWrap;
