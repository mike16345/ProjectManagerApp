import { create } from "zustand";
import { IProject } from "../interfaces";
import { userRequests } from "@/requests/UserRequests";
import { projectRequests } from "@/requests/ProjectRequests";
import { taskRequests } from "@/requests/TaskRequests";
import { refreshData } from "@/requests/dataRefresher";

interface IProjectsStore {
  activeProject: IProject | null;
  projects: IProject[];
  setProjects: (projects: IProject[]) => void;
  setActiveProject: (project: IProject) => void;
  deleteProject: (project: IProject) => void;
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
  async deleteProject(project) {
    await userRequests.removeProjectFromUsers(project._id!);

    project.users.forEach(async (user) => {
      await taskRequests.removeAssignedUserFromTasks(user._id, project._id!);
    });

    await projectRequests.deleteItemRequest(project._id);
    await refreshData();
  },
}));
