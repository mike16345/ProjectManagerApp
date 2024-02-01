import { create } from "zustand";
import { ITask } from "../interfaces";

interface ITasksStore {
  tasks: ITask[];
  taskToEdit: ITask | null;
  setTasks: (tasks: ITask[]) => void;
  setTaskToEdit: (task: ITask | null) => void;
}

export const useTasksStore = create<ITasksStore>((set, get) => ({
  tasks: [],
  taskToEdit: null,
  setTaskToEdit: (task) => {
    set({ taskToEdit: task });
  },
  setTasks: (tasks) => {
    set({ tasks: tasks });
  },
}));
