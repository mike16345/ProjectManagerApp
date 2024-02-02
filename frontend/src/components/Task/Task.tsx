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
      className={`flex flex-col  border-2 hover:shadow-lg  rounded p-2 gap-6  justify-between w-48  cursor-pointer  `}
    >
      <div className="flex flex-col items-start gap-0">
        <span className="font-semibold text-lg text-ellipsis line-clamp-1">
          {task.name}
        </span>
        <span className="text-sm">{task.date_created?.slice(0, 10)!}</span>
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
