import React from "react";
import Task from "./Task";
import { IoMdAdd } from "react-icons/io";
import { ITask } from "../../interfaces";

interface TaskColumnProps {
  header: string;
  tasks: ITask[];
  onTaskClickHandler: (task: ITask) => void;
  onAddTaskClickHandler: () => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  onTaskClickHandler,
  onAddTaskClickHandler,
  header,
  tasks,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className=" flex gap-2 items-center">
        <div className=" bg-red-300 rounded p-[2px] cursor-pointer">
          {header}
        </div>
        <span className="font-semibold">{tasks.length}</span>
        <button
          className=" text-center hover:bg-gray-300/50 hover:rounded"
          onClick={onAddTaskClickHandler}
        >
          <IoMdAdd size={20} />
        </button>
      </div>
      <div className="flex flex-col gap-2 max-h-[75vh] overflow-x-hidden overflow-y-auto">
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
