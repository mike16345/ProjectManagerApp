import axios from "axios";
const APIaddress = "http://localhost:3002";

export const getAllProjects = async () => {
  try {
    const res = axios.get(APIaddress + "/projects");
    return (await res).data;
  } catch (error) {
    return error;
  }
};

export const getProjectsByUser = async (user) => {
  try {
    const res = axios.get(APIaddress + "/projects/perUser/" + user._id);
    return (await res).data;
  } catch (error) {
    return error;
  }
};

// need to better this function
export const updateProjectById = async (project) => {
  const projectToSend = {
    name: project.name,
    id: project.id,
    users: project.users,
  };
  try {
    const res = axios.put(
      APIaddress + "/projects/addUser/" + project._id,
      projectToSend
    );
    return await res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createProject = async (name) => {
  const res = axios.post(APIaddress + "/projects", { name: name });

  return (await res).data;
  // add try catch and return later
};

export const removeAssigndUserFromTasks = async (email, id) => {
  const res = axios.delete(APIaddress + "/tasks/project/" + id, {
    data: {
      email: email,
    },
  });

  return res;
};
