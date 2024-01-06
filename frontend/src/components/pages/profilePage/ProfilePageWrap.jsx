import classes from "./ProfilePage.module.css";

// gets props from Profile

const ProfilePageWrap = (props) => {
  const handler = (event) => {
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
