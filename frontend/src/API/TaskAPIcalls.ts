import axios, { AxiosResponse } from "axios";
import { ITask } from "../interfaces";

const APIaddress = "http://localhost:3002";

export const getAllTasks = async (): Promise<ITask[]> => {
  try {
    const res: AxiosResponse<ITask[]> = await axios.get(`${APIaddress}/tasks`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProjectTasks = async (id: string): Promise<ITask[]> => {
  try {
    const res: AxiosResponse<ITask[]> = await axios.get(
      `${APIaddress}/tasks/byProjectId/${id}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTasksByEmail = async (
  email: string
): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.get(
      `${APIaddress}/tasks/byEmail/${email}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const postTask = async (task: ITask): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.post(`${APIaddress}/tasks`, task);
    return res;
  } catch (error) {
    throw error;
  }
};

export const putEditTask = async (task: ITask): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.put(
      `${APIaddress}/tasks/${task.task_id}`,
      task
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.delete(`${APIaddress}/tasks/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
