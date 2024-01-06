import axios from "axios";

const APIaddress = "http://localhost:3002";

export const getAllTasks = async () => {
  try {
    const res = axios.get(APIaddress + "/tasks");
    return (await res).data;
  } catch (error) {
    return error;
  }
};

export const getAllProjectTasks = async (id) => {
  try {
    const res = axios.get(APIaddress + "/tasks/byProjectId/" + id);
    return (await res).data;
  } catch (error) {
    return error;
  }
};

export const getTasksByEmail = async (email) => {
  try {
    const res = axios.get(APIaddress + "/tasks/byEmail/" + email);
    return await res;
  } catch (error) {
    return error;
  }
};

export const postTask = async (task) => {
  try {
    const res = axios.post(APIaddress + "/tasks", task);
    return await res;
  } catch (error) {
    return error;
  }
};

export const putEditTask = async (task) => {
  try {
    const res = axios.put(`${APIaddress}/tasks/ ${task.task_id}`, task);
    return await res;
  } catch (error) {
    return error;
  }
};

export const deleteTask = async (id) => {
  try {
    const res = axios.delete(`${APIaddress}/tasks/${id}`);
    return await res;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
