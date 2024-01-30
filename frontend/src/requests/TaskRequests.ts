import { ITask } from "@/interfaces";
import { ItemRequests } from "./ItemRequests";
import { updateItem } from "@/API/api";

const TASKS_ENDPOINT = "tasks";

export const BY_PROJECT_ENDPOINT = "byProject";

export class TaskRequests extends ItemRequests<ITask> {
  constructor(endpoint: string) {
    super(endpoint);
  }

  removeAssignedUserFromTasks(userId: string, projectId: string) {
    return updateItem(`${this.endpoint}/assignee`, {
      userId: userId,
      projectId: projectId,
    });
  }
}
export const taskRequests = new TaskRequests(TASKS_ENDPOINT);
