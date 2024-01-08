import React, { FC, MouseEvent } from "react";
import { Fragment } from "react";
import classes from "./Profile.module.css";

interface ProfileProps {
  index: number;
  name: string;
  onClick?: (name: string) => void;
  isList?: boolean;
}

const Profile: FC<ProfileProps> = (props) => {
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

  const color = colors[props.index];
  const shortName = props.name?.substring(0, 2);

  return (
    <Fragment>
      <span
        onClick={() => (props.onClick ? props.onClick(props.name) : () => {})}
        className={`${classes.profileCircle} ${classes[color]} ${
          props.isList ? classes["box-shadow"] : ""
        }`}
      >
        {shortName}
      </span>
    </Fragment>
  );
};

export default Profile;
