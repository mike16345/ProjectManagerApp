import { FC } from "react";
import Tag from "../Tag/Tag";
import { When } from "react-if";
import { ITask } from "../../interfaces";
import { Profile } from "../Profile/Profile";

interface TaskProps {
  task: ITask;
  setTaskToEdit: (task: ITask) => void;
  isMyTasks: boolean;
}

const Task: FC<TaskProps> = ({ isMyTasks, task, setTaskToEdit }) => {
  return (
    <div
      onClick={() => setTaskToEdit(task)}
      className={` border-2 rounded p-2 gap-10 flex flex-col hover:shadow-lg justify-between w-48  cursor-pointer  `}
    >
      <div className=" text-lg font-semibold text-ellipsis line-clamp-2">
        {task.name}
      </div>
      <div className=" flex items-center  justify-between">
        <Tag isMyTasks={isMyTasks} priority={task.priority} />
        <When condition={task.assignee !== "none@gmail.com"}>
          <Profile width={8} height={8} user={task.assignee} />
        </When>
      </div>
    </div>
  );
};

export default Task;
