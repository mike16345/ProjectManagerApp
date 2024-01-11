import React, { FC, MouseEvent } from "react";
import { Fragment } from "react";
import classes from "./Profile.module.css";

interface ProfileProps {
  index?: number;
  name?: string;
  onClick?: (name: string) => void;
  isList?: boolean;
}

const Profile: FC<ProfileProps> = ({ index, onClick, isList, name }) => {
  const colors = [
    "brown",
    "green",
    "yellow",
    "red",
    "grey",
    "black",
    "lightBlue",
    "chocolate",
  ];

  const color = colors[index || 0];
  const shortName = name?.substring(0, 2);

  return (
    <Fragment>
      <span
        onClick={() => (onClick ? onClick(name || "") : () => {})}
        className={`${classes.profileCircle} ${classes[color]} ${
          isList ? classes["box-shadow"] : ""
        }`}
      >
        {shortName}
      </span>
    </Fragment>
  );
};

export default Profile;
