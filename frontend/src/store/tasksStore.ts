import { create } from "zustand";
import { ITask } from "../interfaces";

interface ITasksStore {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
}

export const useTasksStore = create<ITasksStore>((set, get) => ({
  tasks: [],
  setTasks: (tasks) => {
    set({ tasks: tasks });
  },
}));
