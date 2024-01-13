export interface Project {
  _id: string;
  name: string;
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

export interface GoogleUser extends User {
  id: string;
  locale: string;
  picture: string;
  verified_email: boolean;
}
export interface Task {}
