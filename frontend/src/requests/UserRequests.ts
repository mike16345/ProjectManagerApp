import { IUser } from "@/interfaces";
import { ItemRequests } from "./ItemRequests";

const USERS_ENDPOINT = "users";

export const userRequests = new ItemRequests<IUser>(USERS_ENDPOINT);
