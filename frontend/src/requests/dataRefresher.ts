import { taskRequests } from "./TaskRequests";
import { projectRequests } from "./ProjectRequests";
import { userRequests } from "./UserRequests";
import { useUsersStore } from "@/store/usersStore";
import { useProjectsStore } from "@/store/projectsStore";
import { useTasksStore } from "@/store/tasksStore";

export const refreshData = async () => {
  taskRequests.getItemsRequest().then((tasks) => {
    useTasksStore.getState().setTasks(tasks);
  });

  projectRequests
    .getItemsRequest()
    .then((projects) => useProjectsStore.getState().setProjects(projects));

  userRequests
    .getItemsRequest()
    .then((users) => useUsersStore.getState().setUsers(users));
};
