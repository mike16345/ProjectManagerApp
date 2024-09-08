import { IProject } from "@/interfaces";
import { ItemRequests } from "./ItemRequests";
import { updateItem } from "@/API/api";

const PROJECT_ENDPOINT = "projects";

class ProjectRequests extends ItemRequests<IProject> {
  constructor(endpoint: string) {
    super(endpoint);
  }

  async removeUserFromProject(userId: string, projectId: string) {
    return await updateItem<IProject>(`${this.endpoint}/user`, {
      userId: userId,
      projectId: projectId,
    });
  }
}
export const projectRequests = new ProjectRequests(PROJECT_ENDPOINT);
export const BY_USER_ENDPOINT = "byUser";
