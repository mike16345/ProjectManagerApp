import { INotification } from "./../../backend/src/interfaces";
import { Priority } from "./enums/Priority";
import { ProjectType } from "./enums/ProjectType";
import { TaskStatus } from "./enums/TaskStatus";

export interface IProject {
  _id?: string;
  name: string;
  users: IUser[];
  description?: string;
  deadline?: Deadline;
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
  date_created?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  type: string;
  notifications: INotification[];
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
  endDate: Date;
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
