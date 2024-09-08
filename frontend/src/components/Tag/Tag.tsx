import { FC } from "react";
import { Priority } from "../../enums/Priority";

interface TagProps {
  priority: Priority;
  isMyTasks: boolean;
}

const priorityToBgColor = (priority: Priority) => {
  switch (priority) {
    case Priority.EPIC:
      return "bg-red-600";
    case Priority.HIGH:
      return "bg-amber-600";
    case Priority.LOW:
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
};

const Tag: FC<TagProps> = ({ priority, isMyTasks }) => {
  return (
    <p
      className={` font-black  bg- rounded px-2 py-[2px] text-sm ${priorityToBgColor(
        priority
      )} `}
    >
      {priority}
    </p>
  );
};

export default Tag;
