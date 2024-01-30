import { ITask } from "@/interfaces";
import { ItemRequests } from "./ItemRequests";

const TASKS_ENDPOINT = "tasks";

export const taskRequests = new ItemRequests<ITask>(TASKS_ENDPOINT);
