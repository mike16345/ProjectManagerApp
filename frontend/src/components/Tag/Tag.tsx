import { FC } from "react";
import { Priority } from "../../enums/Priority";

interface TagProps {
  priority: Priority;
  isMyTasks: boolean;
}
const priorityToBgColor = (priority: Priority) => {
  switch (priority) {
    case Priority.EPIC:
      return "bg-red-500";
    case Priority.HIGH:
      return "bg-yellow-500";
    case Priority.LOW:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
const Tag: FC<TagProps> = ({ priority, isMyTasks }) => {
  return (
    <p
      className={` font-bold rounded p-1 text-sm ${priorityToBgColor(
        priority
      )} `}
    >
      {priority}
    </p>
  );
};

export default Tag;
