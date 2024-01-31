import { create } from "zustand";
import { IProject } from "../interfaces";
import { userRequests } from "@/requests/UserRequests";
import { BY_USER_ENDPOINT, projectRequests } from "@/requests/ProjectRequests";
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
    // 65ad181093fd68f77236fe4a
    // 65ad181093fd68f77236fe4a
    console.log("project id:", project._id);
    const res = await userRequests.removeProjectFromUsers(project._id!);
    console.log("res:", res);

    project.users.forEach(async (user) => {
      await taskRequests.removeAssignedUserFromTasks(user._id, project._id!);
    });

    const resp = await projectRequests.deleteItemRequest(project._id);
    console.log("resp:", resp);
    await refreshData();
  },
}));
