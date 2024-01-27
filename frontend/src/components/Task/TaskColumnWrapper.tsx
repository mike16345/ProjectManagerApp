import React from "react";
import TaskColumn from "./TaskColumn";
import { IAllTasks, ITask } from "../../interfaces";
import { TaskStatus } from "../../enums/TaskStatus";

interface TaskColumnWrapperProps {
  handleAddNewTask: (taskTypeToAdd: TaskStatus) => void;
  onTaskClickHandler: (task: ITask) => void;
  tasks: IAllTasks;
}

const TaskColumnWrapper: React.FC<TaskColumnWrapperProps> = ({
  onTaskClickHandler,
  handleAddNewTask,
  tasks,
}) => {
  return (
    <div className=" flex w-full justify-around p-2 ">
      {Object.values(TaskStatus).map((status) => {
        return (
          <TaskColumn
            key={status}
            header={status}
            onAddTaskClickHandler={() => handleAddNewTask(status)}
            onTaskClickHandler={onTaskClickHandler}
            tasks={tasks[status]}
          />
        );
      })}
    </div>
  );
};

export default TaskColumnWrapper;
