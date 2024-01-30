import { IProject } from "@/interfaces";
import { ItemRequests } from "./ItemRequests";

const PROJECT_ENDPOINT = "projects";

export const projectRequests = new ItemRequests<IProject>(PROJECT_ENDPOINT);
