import { FC } from "react";
import Tag from "../Tag/Tag";
import { When } from "react-if";
import { ITask, IUser } from "../../interfaces";
import { Profile } from "../Profile/Profile";
import { getOneUser } from "@/API/UserAPIcalls";

interface TaskProps {
  task: ITask;
  setTaskToEdit: (task: ITask) => void;
  isMyTasks: boolean;
}

const Task: FC<TaskProps> = ({ isMyTasks, task, setTaskToEdit }) => {
  console.log("Task:", task);
  return (
    <div
      onClick={() => setTaskToEdit(task)}
      className={` border rounded p-2 gap-3 flex flex-col hover:shadow-lg justify-between w-40 h-28 cursor-pointer  `}
    >
      <div className="  font-semibold text-ellipsis line-clamp-2">
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
