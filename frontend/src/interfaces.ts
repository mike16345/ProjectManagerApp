import { Priority } from "./enums/Priority";
import { TaskStatus } from "./enums/TaskStatus";

export interface IProject {
  _id: string;
  name: string;
  users: IUser[];
  date_created?: Date;
}

export interface ITask {
  text: string;
  email: string;
  task_id: number;
  priority: Priority;
  status: TaskStatus;
  project_id: string;
}

export interface IAdmin extends IUser {}
export interface IUser {
  _id: string;
  name: string;
  email: string;
  type: string;
  projects: string[];
  isAdmin: boolean;
  dateCreated: Date;
}

export interface IGoogleUser extends IUser {
  id: string;
  locale: string;
  picture: string;
  verified_email: boolean;
}

export interface IAllTasks {
  [TaskStatus.TODO]: ITask[];
  [TaskStatus.IN_PROGRESS]: ITask[];
  [TaskStatus.CODE_REVIEW]: ITask[];
  [TaskStatus.DONE]: ITask[];
}
