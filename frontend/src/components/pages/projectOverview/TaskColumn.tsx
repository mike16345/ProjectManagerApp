import React from "react";
import Task from "../../task/Task";
import { IoMdAdd } from "react-icons/io";
import { ITask } from "../../../interfaces";

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
    <div className="column">
      <div className=" flex gap-2 items-center">
        <div className=" bg-red-300 rounded p-[2px] cursor-pointer">
          {header}
        </div>
        <div>{tasks.length}</div>
        <button
          className=" text-center hover:bg-gray-300/50 hover:rounded"
          onClick={onAddTaskClickHandler}
        >
          <IoMdAdd size={20} />
        </button>
      </div>
      <div className="column-body">
        {tasks.map((task, index) => (
          <Task setTaskToEdit={onTaskClickHandler} key={index} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
