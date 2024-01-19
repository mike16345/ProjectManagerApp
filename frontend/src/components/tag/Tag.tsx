import { FC } from "react";
import { Priority } from "../../enums/Priority";

interface TagProps {
  priority: Priority;
  isMyTasks: boolean;
}
//Props from test modal
const Tag: FC<TagProps> = ({ priority, isMyTasks }) => {
  return <p className={` font-bold `}>{priority}</p>;
};

export default Tag;
