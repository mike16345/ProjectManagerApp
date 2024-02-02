import React from "react";
import Task from "./Task";
import { IoMdAdd } from "react-icons/io";
import { ITask } from "../../interfaces";
import { TaskStatus } from "@/enums/TaskStatus";
import { Separator } from "../ui/separator";

interface TaskColumnProps {
  header: TaskStatus;
  tasks: ITask[];
  onTaskClickHandler: (task: ITask) => void;
  onAddTaskClickHandler: () => void;
}

const statusToColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return "bg-red-500";
    case TaskStatus.CODE_REVIEW:
      return "bg-yellow-600";
    case TaskStatus.IN_PROGRESS:
      return "bg-blue-500";
    case TaskStatus.DONE:
      return "bg-green-500";
  }
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  onTaskClickHandler,
  onAddTaskClickHandler,
  header,
  tasks,
}) => {
  return (
    <div className="flex flex-col gap-2  ">
      <div className=" flex gap-2 items-center justify-between">
        <div className=" flex-center gap-4">
          <div
            className={` ${statusToColor(
              header
            )} rounded px-2 py-1 text-primary-foreground font-bold cursor-pointer`}
          >
            {header}
          </div>
          <span className="font-semibold">{tasks.length}</span>
        </div>
        <button
          className=" text-center hover:bg-gray-300/50 hover:rounded"
          onClick={onAddTaskClickHandler}
        >
          <IoMdAdd size={20} />
        </button>
      </div>
      <Separator className="mb-2" />

      <div className="flex flex-col p-1 gap-2 max-h-[80vh] max-w-52 w-52 overflow-x-hidden overflow-y-auto">
        {tasks.map((task, index) => (
          <Task
            isMyTasks={false}
            setTaskToEdit={onTaskClickHandler}
            key={index}
            task={task}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
