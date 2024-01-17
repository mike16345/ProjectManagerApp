import { FC } from "react";
import Profile from "../profile/Profile";
import Tag from "../tag/Tag";
import classes from "./Task.module.css";
import { When } from "react-if";
import { ITask } from "../../interfaces";

interface TaskProps {
  task: ITask;
  isMyTasks?: boolean;
  setTaskToEdit: (task: ITask) => void;
}

const Task: FC<TaskProps> = ({ style, isMyTasks, task, setTaskToEdit }) => {
  return (
    <div
      onClick={() => setTaskToEdit(task)}
      className={`${classes.taskContainer} ${classes[style]}`}
    >
      <div className={classes.text}>{task.text}</div>
      <footer className={classes.footer}>
        <Tag>{task.priority}</Tag>
        <When condition={isMyTasks}>
          <Tag isMyTasks={isMyTasks}>{task.status}</Tag>
        </When>
        <When condition={task.email !== "none@gmail.com"}>
          <Profile name={task.email} />
        </When>
      </footer>
    </div>
  );
};

export default Task;
