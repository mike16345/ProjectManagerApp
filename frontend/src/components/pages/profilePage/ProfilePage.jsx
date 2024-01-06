import classes from "./ProfilePage.module.css";
import ProfilePageWrap from "./ProfilePageWrap";
import Button from "../../button/Button";
import Profile from "../../profile/Profile";
import AppContext from "../../../context/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = (props) => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const onMyTasksClickHandler = () => {
    navigate("myTasks");
  };

  const onLogOutClickHandler = () => {
    props.logOut();
  };

  const onCloseProfileHandler = () => {
    props.onCloseProfile();
  };
  return (
    <ProfilePageWrap onCloseProfile={onCloseProfileHandler}>
      <Profile name={context.userLogged.email} />
      <div className={classes.username}>{context.userLogged.name}</div>
      <div className={classes.email}>{context.userLogged.email}</div>
      <Button onClick={onMyTasksClickHandler}>My tasks</Button>
      <Button onClick={onLogOutClickHandler}>Log out</Button>
    </ProfilePageWrap>
  );
};

export default ProfilePage;
