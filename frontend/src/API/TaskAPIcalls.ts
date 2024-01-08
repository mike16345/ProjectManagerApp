import axios, { AxiosResponse } from "axios";

const APIaddress = "http://localhost:3002";

// Define types for the data returned from the API
interface Task {
  task_id: string;
  // Define other properties of a task as needed
}

// Use async/await properly and add type annotations
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const res: AxiosResponse<Task[]> = await axios.get(`${APIaddress}/tasks`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProjectTasks = async (id: string): Promise<Task[]> => {
  try {
    const res: AxiosResponse<Task[]> = await axios.get(
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

export const postTask = async (task: Task): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.post(`${APIaddress}/tasks`, task);
    return res;
  } catch (error) {
    throw error;
  }
};

export const putEditTask = async (task: Task): Promise<AxiosResponse> => {
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

export const deleteTask = async (id: string): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.delete(`${APIaddress}/tasks/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
