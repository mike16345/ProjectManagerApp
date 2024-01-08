import axios, { AxiosResponse } from "axios";

const APIaddress = "http://localhost:3002";

// Define types for the data returned from the API
interface Project {
  _id: string;
  name: string;
  users: string[];
}

// Define types for the parameters used in the functions
interface User {
  _id: string;
}

interface UpdateProject {
  _id: string;
  name: string;
  users: string[];
}

// Use async/await properly and add type annotations
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const res: AxiosResponse<Project[]> = await axios.get(
      `${APIaddress}/projects`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProjectsByUser = async (user: User): Promise<Project[]> => {
  try {
    const res: AxiosResponse<Project[]> = await axios.get(
      `${APIaddress}/projects/perUser/${user._id}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Improve the updateProjectById function
export const updateProjectById = async (
  project: UpdateProject
): Promise<void> => {
  try {
    await axios.put(`${APIaddress}/projects/addUser/${project._id}`, {
      name: project.name,
      id: project._id,
      users: project.users,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createProject = async (name: string): Promise<Project> => {
  try {
    const res: AxiosResponse<Project> = await axios.post(
      `${APIaddress}/projects`,
      { name }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeAssignedUserFromTasks = async (
  email: string,
  id: string
): Promise<void> => {
  try {
    await axios.delete(`${APIaddress}/tasks/project/${id}`, {
      data: {
        email,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
