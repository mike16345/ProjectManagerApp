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
  return (
    <div
      onClick={() => setTaskToEdit(task)}
      className={` border rounded p-2 flex flex-col  hover:shadow-lg justify-between w-40 h-28 cursor-pointer  `}
    >
      <div className="  font-semibold truncate">{task.name}</div>
      <div className=" flex items-center justify-between">
        <Tag isMyTasks={isMyTasks} priority={task.priority} />
        <When condition={task.assignee !== "none@gmail.com"}>
          <Profile
            width={8}
            height={8}
            user={getOneUser(task.assignee).then((user: IUser) => user)}
          />
        </When>
      </div>
    </div>
  );
};

export default Task;
