import React, { FC, MouseEvent } from "react";
import Profile from "../profile/Profile";
import Tag from "../tag/Tag";
import classes from "./Task.module.css";

interface TaskProps {
  taskNumber: number;
  status: string;
  style: string;
  taskText: string;
  priority: string;
  isMyTasks?: boolean;
  onUpdate?: (taskId: string, status: string) => void;
  assignee: string;
}

const Task: FC<TaskProps> = (props) => {
  const onTaskClickHandler = (event: MouseEvent) => {
    event.stopPropagation(); // Prevents the click event from propagating to parent elements
    if (props.onUpdate) {
      props.onUpdate(props.taskNumber, props.status);
    }
  };

  return (
    <div
      onClick={props.onUpdate ? onTaskClickHandler : undefined}
      className={`${classes.taskContainer} ${classes[props.style]}`}
    >
      <p className={classes.text}>{props.taskText}</p>
      <footer className={classes.footer}>
        <Tag>{props.priority}</Tag>
        {props.isMyTasks && (
          <Tag isMyTasks={props.isMyTasks}>{props.status}</Tag>
        )}
        {props.assignee !== "none@gmail.com" && (
          <Profile name={props.assignee} index={0} />
        )}
      </footer>
    </div>
  );
};

export default Task;
