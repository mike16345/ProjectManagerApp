import React, { FC, MouseEvent } from "react";
import Profile from "../profile/Profile";
import Tag from "../tag/Tag";
import classes from "./Task.module.css";
import { When } from "react-if";

interface TaskProps {
  taskNumber: string;
  status: string;
  style: string;
  taskText: string;
  priority: string;
  isMyTasks?: boolean;
  onUpdate?: (taskId: string, status: string) => void;
  assignee: string;
}

const Task: FC<TaskProps> = ({
  taskNumber,
  status,
  style,
  taskText,
  priority,
  isMyTasks,
  onUpdate,
  assignee,
}) => {
  const onTaskClickHandler = (event: MouseEvent) => {
    event.stopPropagation();
    if (onUpdate) {
      onUpdate(taskNumber, status);
    }
  };

  return (
    <div
      onClick={onUpdate ? onTaskClickHandler : undefined}
      className={`${classes.taskContainer} ${classes[style]}`}
    >
      <p className={classes.text}>{taskText}</p>
      <footer className={classes.footer}>
        <Tag>{priority}</Tag>
        <When condition={isMyTasks}>
          <Tag isMyTasks={isMyTasks}>{status}</Tag>
        </When>
        <When condition={assignee !== "none@gmail.com"}>
          <Profile name={assignee} index={0} />
        </When>
      </footer>
    </div>
  );
};

export default Task;
