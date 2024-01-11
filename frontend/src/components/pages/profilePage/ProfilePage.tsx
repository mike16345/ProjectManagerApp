import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePageWrap from "./ProfilePageWrap";
import Button from "../../button/Button";
import Profile from "../../profile/Profile";
import AppContext from "../../../context/context";

interface ProfilePageProps {
  logOut: () => void;
  onCloseProfile: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  logOut,
  onCloseProfile,
}) => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const onMyTasksClickHandler = () => {
    navigate("myTasks");
  };

  return (
    <ProfilePageWrap onCloseProfile={onCloseProfile}>
      <Profile name={context.userLogged?.email} />
      <div className="username">{context.userLogged?.name}</div>
      <div className="email">{context.userLogged?.email}</div>
      <Button onClick={onMyTasksClickHandler}>My tasks</Button>
      <Button onClick={logOut}>Log out</Button>
    </ProfilePageWrap>
  );
};

export default ProfilePage;
