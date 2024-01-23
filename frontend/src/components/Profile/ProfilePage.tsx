import React, { MutableRefObject } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "./Profile";
import { useUsersStore } from "../../store/usersStore";
import { useClickAway } from "@uidotdev/usehooks";


interface ProfilePageProps {
  logOut: () => void;
  onCloseProfile: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  logOut,
  onCloseProfile,
}) => {
  const navigate = useNavigate();
  const ref = useClickAway(() => {
    onCloseProfile();
  }) as MutableRefObject<HTMLDivElement>;

  const { activeUser } = useUsersStore();
  const onMyTasksClickHandler = () => {
    navigate("myTasks");
  };

  return (
    <div
      className=" fixed top-[15%] right-2 flex flex-col items-center justify-center gap-2 p-2 bg-purple-500 border-2 border-black rounded-xl"
      ref={ref}
    >
      <Profile name={activeUser?.email} />
      <div className="username">{activeUser?.name}</div>
      <div className="email">{activeUser?.email}</div>
      <button
        className=" border-2  text-white p-2 w-full rounded-md hover:scale-105"
        onClick={onMyTasksClickHandler}
      >
        My Tasks
      </button>
      <button
        className="border-2 p-2 w-full text-white rounded-md hover:scale-105"
        onClick={() => logOut()}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
