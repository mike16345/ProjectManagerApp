export interface IUser {
  name: string;
  email: string;
  type: string;
  picture: string;
  projects: IProject[];
  isAdmin: boolean;
  date_created: Date;
}

export interface IProject {
  id: string;
  users: Array<string>;
  name: string;
  date_created: Date;
}

export interface ITask {
  name: string;
  assignee: string;
  description: string;
  task_id: number;
  priority: string;
  status: string;
  project_id: string;
}
