import { Priority } from "./enums/Priority";
import { ProjectType } from "./enums/ProjectType";
import { TaskStatus } from "./enums/TaskStatus";

export interface IProject {
  _id?: string;
  name: string;
  users: IUser[];
  description?: string;
  deadline?: Deadline | null;
  projectLead: IUser;
  projectType: ProjectType;
  date_created?: string;
}

export interface ITask {
  _id?: string;
  name: string;
  assignee?: IUser;
  description: string;
  priority: Priority;
  status: TaskStatus;
  project_id: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  type: string;
  picture: string;
  projects: string[];
  isAdmin: boolean;
  date_created: string;
}

export interface IGoogleUser extends IUser {
  id: string;
  locale: string;
  picture: string;
  verified_email: boolean;
}

export interface Deadline {
  startDate: Date;
  endDate: Date | null;
}

export interface IAllTasks {
  [TaskStatus.TODO]: ITask[];
  [TaskStatus.IN_PROGRESS]: ITask[];
  [TaskStatus.CODE_REVIEW]: ITask[];
  [TaskStatus.DONE]: ITask[];
}

export interface Option {
  ["name"]: string;
  ["value"]: string | number | object;
}
