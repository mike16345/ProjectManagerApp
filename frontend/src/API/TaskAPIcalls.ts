import axios, { AxiosResponse } from "axios";
import { ITask } from "../interfaces";

const APIaddress = "http://localhost:3002";

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
