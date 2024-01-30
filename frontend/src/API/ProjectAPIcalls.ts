import axios, { AxiosResponse } from "axios";


const APIaddress = "http://localhost:3002";

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
