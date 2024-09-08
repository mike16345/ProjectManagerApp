import React from "react";
import TaskColumn from "./TaskColumn";
import { IAllTasks, ITask } from "../../interfaces";
import { TaskStatus } from "../../enums/TaskStatus";
import { Separator } from "../ui/separator";
import { Else, If, Then, When } from "react-if";
import { enumToArray } from "@/utils/utils";

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
  const taskStatuses = enumToArray(TaskStatus) as TaskStatus[];

  const isTasksEmpty = () => {
    for (var i = 0; i < taskStatuses.length; i++) {
      if (tasks[taskStatuses[i]].length > 0) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className=" flex justify-evenly h-full overflow-hidden">
      <If condition={isTasksEmpty()}>
        <Then>
          <div className="fixed bottom-1/3 text-center ">
            {"Looks kind of empty here"}
          </div>
        </Then>
      </If>
      {taskStatuses.map((status, index) => {
        return (
          <TaskColumn
            key={index}
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
