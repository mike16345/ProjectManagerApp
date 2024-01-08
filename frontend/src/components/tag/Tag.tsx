import React, { FC } from "react";
import classes from "./Tag.module.css";

interface TagProps {
  isMyTasks?: boolean;
  children: React.ReactNode;
}
//Props from test modal
const Tag: FC<TagProps> = (props) => {
  return (
    <p
      className={`${classes[`priority-${props.children}`]} ${
        props.isMyTasks ? classes.status : ""
      }`}
    >
      {props.children}
    </p>
  );
};

export default Tag;
