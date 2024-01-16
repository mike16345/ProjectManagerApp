import { Priority } from "./enums/Priority";
import { TaskStatus } from "./enums/TaskStatus";

export interface Project {
  _id: string;
  name: string;
  users: User[];
  date_created?: Date;
}

export interface Task {
  text: string;
  email: string;
  task_id: number;
  priority: Priority;
  status: TaskStatus;
  project_id: string;
}

export interface Admin extends User {}
export interface User {
  _id: string;
  name: string;
  email: string;
  type: string;
  projects: string[];
  isAdmin: boolean;
  dateCreated: Date;
}

export interface GoogleUser extends User {
  id: string;
  locale: string;
  picture: string;
  verified_email: boolean;
}
