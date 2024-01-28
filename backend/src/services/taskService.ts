import { TaskModel } from "../models/taskModel";

export const removeUserFromTasks = async (
  projectId: string,
  userEmail: string
) => {
  await TaskModel.updateMany(
    { project_id: projectId, email: userEmail },
    { $set: { email: "none@gmail.com" } }
  );
};
