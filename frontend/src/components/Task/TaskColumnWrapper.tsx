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
    <div className=" flex justify-start p-2 ">
      <div className=" flex gap-24">
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
    </div>
  );
};

export default TaskColumnWrapper;
