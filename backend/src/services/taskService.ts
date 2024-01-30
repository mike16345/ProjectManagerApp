import { Task } from "../models/taskModel";

export class TaskService {
  async createTask(data: any) {
    try {
      const newTask = await Task.create(data);

      return newTask;
    } catch (error) {
      console.log(error);
    }
  }

  async getTasks() {
    try {
      const tasks = await Task.find({});
      return tasks;
    } catch (error) {
      console.log(error);
    }
  }

  async getTask(id: string) {
    try {
      const task = await Task.findById({ _id: id });
      if (!task) {
        return "Task not available";
      }

      return task;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTask(id: string, data: any) {
    try {
      const task = await Task.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      });

      if (!task) {
        return "Task not available";
      }
      return task;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTask(id: string) {
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return "task not available";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const taskServices = new TaskService();

export const removeUserFromTasks = async (
  projectId: string,
  userEmail: string
) => {
  await Task.updateMany(
    { task_id: projectId, email: userEmail },
    { $set: { email: "none@gmail.com" } }
  );
};
