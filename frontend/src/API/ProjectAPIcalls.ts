import axios, { AxiosResponse } from "axios";
import { IProject, IUser } from "../interfaces";

const APIaddress = "http://localhost:3002";

export const getAllProjects = async (): Promise<IProject[]> => {
  try {
    const res: AxiosResponse<IProject[]> = await axios.get(
      `${APIaddress}/projects`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProjectsByUser = async (user: IUser): Promise<IProject[]> => {
  try {
    const res: AxiosResponse<IProject[]> = await axios.get(
      `${APIaddress}/projects/perUser/${user._id}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Improve the updateProjectById function
export const updateProjectById = async (project: IProject): Promise<void> => {
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

export const createProject = async (name: string): Promise<IProject> => {
  try {
    const res: AxiosResponse<IProject> = await axios.post(
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
