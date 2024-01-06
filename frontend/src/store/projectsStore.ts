import { create } from "zustand";
import { Project } from "../interfaces";

interface IProjectsStore {
  activeProject: Project | null;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project) => void;
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
