import { FC } from "react";
import classes from "./Tag.module.css";
import { Priority } from "../../enums/Priority";

interface TagProps {
  priority: Priority;
  isMyTasks: boolean;
}
//Props from test modal
const Tag: FC<TagProps> = ({ priority, isMyTasks }) => {
  return <p className={` ${isMyTasks ? classes.status : ""}`}>{priority}</p>;
};

export default Tag;
