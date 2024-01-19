import { TaskModel } from "../models/taskModel";

export const removeUserFromTasks = async (
  projectId: string,
  userEmail: string
) => {
  let tasks = await TaskModel.updateMany(
    { project_id: projectId, email: userEmail },
    { $set: { email: "none@gmail.com" } }
  );
};
