export interface IUser {
  name: string;
  email: string;
  type: string;
  picture: string;
  projects: string[];
  isAdmin: boolean;
  date_created: Date;
}

export interface IProject extends Document {
  id: string;
  projectLead: object;
  users: Array<object>;
  deadline: object;
  projectType: string;
  name: string;
  description: string;
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
