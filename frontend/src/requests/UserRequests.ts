import { IUser } from "@/interfaces";
import { ItemRequests } from "./ItemRequests";
import { deleteItem, fetchData, sendData } from "@/API/api";

const USERS_ENDPOINT = "users";

export const BY_EMAIL_ENDPOINT = "byEmail";

interface AuthResponse {
  status?: string;
  isNew?: boolean;
  token?: string;
  user?: any;
}

class UserRequests extends ItemRequests<IUser> {
  constructor(endpoint: string) {
    super(endpoint);
  }

  loginHandler = async (user: any) => {
    try {
      return await sendData<AuthResponse>(`${this.endpoint}/login`, user);
    } catch (error) {
      throw error;
    }
  };

  registerHandler = async (user: any): Promise<AuthResponse> => {
    try {
      return await sendData<AuthResponse>(`${this.endpoint}/register`, user);
    } catch (error) {
      throw error;
    }
  };

  verifyToken = (token: string) => {
    try {
      return fetchData<IUser>(`${this.endpoint}/tokenLogin`, "", {
        "x-api-key": token,
      });
    } catch (error) {
      throw error;
    }
  };

  removeProjectFromUsers(projectId: string) {
    return deleteItem(`${this.endpoint}/delete/projects`, projectId);
  }
}
export const userRequests = new UserRequests(USERS_ENDPOINT);
