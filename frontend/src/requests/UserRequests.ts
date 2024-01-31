import { IUser } from "@/interfaces";
import { ItemRequests } from "./ItemRequests";
import { deleteItem } from "@/API/api";

const USERS_ENDPOINT = "users";

export const BY_EMAIL_ENDPOINT = "byEmail";

class UserRequests extends ItemRequests<IUser> {
  constructor(endpoint: string) {
    super(endpoint);
  }
  removeProjectFromUsers(projectId: string) {
    return deleteItem(`${this.endpoint}/delete/projects`, projectId);
  }
}
export const userRequests = new UserRequests(USERS_ENDPOINT);
