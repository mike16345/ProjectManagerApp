const { TaskModel } = require("../models/taskModel");

exports.removeUserFromTasks = async (projectId, userEmail) => {
  let tasks = await TaskModel.updateMany(
    { project_id: projectId, email: userEmail },
    { $set: { email: "none@gmail.com" } }
  );
};
///
