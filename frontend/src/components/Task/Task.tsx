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
      className={` border rounded p-2 flex flex-col gap-2 w-36   cursor-pointer scale-105`}
    >
      <div className=" self-start">{task.text}</div>
      <div className=" flex items-center justify-between">
        <Tag isMyTasks={isMyTasks} priority={task.priority} />
        <When condition={task.email !== "none@gmail.com"}>
          <Profile
            width=" w-7"
            height="h-7"
            user={getOneUser(task.email).then((user: IUser) => user)}
          />
        </When>
      </div>
    </div>
  );
};

export default Task;
