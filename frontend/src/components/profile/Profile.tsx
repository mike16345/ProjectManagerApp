import React, { FC } from "react";
import { Fragment } from "react";

interface ProfileProps {
  index?: number;
  name?: string;
  onClick?: (name: string) => void;
  isList?: boolean;
}

const Profile: FC<ProfileProps> = ({ index, onClick, isList, name }) => {
  const shortName = name?.substring(0, 2).toUpperCase();
  const handleClick = () => {
    if (onClick) onClick(name || "");
  };
  return (
    <Fragment>
      <div
        onClick={handleClick}
        className="rounded-full bg-red-500 cursor-pointer hover:scale-105   filter-shadow w-10 h-10 font-bold text-center flex justify-center items-center "
      >
        {shortName}
      </div>
    </Fragment>
  );
};

export default Profile;
