import React from "react";
import TaskColumn from "./TaskColumn";
import { IAllTasks, ITask } from "../../interfaces";
import { TaskStatus } from "../../enums/TaskStatus";
import { Separator } from "../ui/separator";
import { When } from "react-if";
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
  console.log(taskStatuses);
  return (
    <div className=" flex w-full justify-around p-2 ">
      {taskStatuses.map((status, index) => {
        return (
          <div className="flex gap-12">
            <TaskColumn
              key={status}
              header={status}
              onAddTaskClickHandler={() => handleAddNewTask(status)}
              onTaskClickHandler={onTaskClickHandler}
              tasks={tasks[status]}
            />
            <When condition={index !== taskStatuses.length - 1}>
              <Separator className="mt-12 w-[2px]" orientation="vertical" />
            </When>
          </div>
        );
      })}
    </div>
  );
};

export default TaskColumnWrapper;
