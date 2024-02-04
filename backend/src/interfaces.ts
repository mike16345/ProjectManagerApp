export interface IUser {
  id: string;
  name: string;
  email: string;
  type: string;
  picture: string;
  notifications: INotification[];
  projects: string[];
  isAdmin: boolean;
  date_created: Date;
}

export interface INotification {
  _id: string;
  title: string;
  from: string;
  isNew: boolean;
  date_created: Date;
  projectId: string;
  type: string;
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
  id: string;
  name: string;
  assignee: string;
  description: string;
  priority: string;
  status: string;
  project_id: string;
  date_created: Date;
}
