export interface Project {
  _id: string;
}
export interface Task {
  text: string;
  email: string;
  task_id: number;
  priority: string;
  status: string;
  project_id: string;
}

export interface Admin extends User {}
export interface User {
  _id: string;
  name: string;
  email: string;
  type: string;
  projects: Project[];
  isAdmin: boolean;
  dateCreated: Date;
}

export interface Task {}
