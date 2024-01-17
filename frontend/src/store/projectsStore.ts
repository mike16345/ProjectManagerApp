import { create } from "zustand";
import { IProject } from "../interfaces";

interface IProjectsStore {
  activeProject: IProject | null;
  projects: IProject[];
  setProjects: (projects: IProject[]) => void;
  setActiveProject: (project: IProject) => void;
}

export const useProjectsStore = create<IProjectsStore>((set, get) => ({
  projects: [],
  activeProject: null,
  setProjects: (projects) => {
    set({ projects: projects });
  },
  setActiveProject: (project) => {
    set({ activeProject: project });
  },
}));
