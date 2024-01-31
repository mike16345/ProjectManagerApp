import { Task } from "../models/taskModel";
import { User } from "../models/userModel";

export class TaskService {
  async createTask(data: any) {
    try {
      const newTask = await Task.create(data);
      console.log("new task", newTask);
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

  async getTasksByUser(id: string) {
    try {
      const tasks = await Task.find({ "assignee._id": id });

      return tasks;
    } catch (error) {
      console.log(error);
    }
  }
  async getTasksByProject(id: string) {
    try {
      const tasks = await Task.find({ project_id: id });
      return tasks;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTask(data: any) {
    try {
      const task = await Task.findByIdAndUpdate({ _id: data._id }, data, {
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

  async updateManyTasks(data: any[]) {
    try {
      const updatedTasks = await Promise.all(
        data.map(async (task) => {
          return await this.updateTask(task);
        })
      );

      return updatedTasks;
    } catch (error) {
      console.log(error);
    }
  }
  async removeUserFromTasks(projectId: string, userId: string) {
    const tasks = await Task.updateMany(
      { project_id: projectId, "assignee._id": userId },
      { $set: { assignee: {} } }
    );

    return tasks;
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
  userId: string
) => {
  await Task.updateMany(
    { project_id: projectId, "assignee._id": userId },
    { $set: { assignee: {} } }
  );
};
