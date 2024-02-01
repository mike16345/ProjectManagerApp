import { taskServices } from "../services/taskService";
import { Request, Response } from "express";
import { TaskSchemaValidation } from "../models/taskModel";
import { ITask } from "../interfaces";

class taskController {
  addTask = async (req: Request, res: Response) => {
    const data = {
      name: req.body.name,
      assignee: req.body.assignee,
      description: req.body.description,
      status: req.body.status,
      project_id: req.body.project_id,
      priority: req.body.priority,
    };

    const { error, value } = TaskSchemaValidation.validate(data);

    if (error) {
      res.send(error.message);
    } else {
      const task = await taskServices.createTask(value);
      res.status(201).send(task);
    }
  };

  getTasks = async (req: Request, res: Response) => {
    const tasks = await taskServices.getTasks();
    res.send(tasks);
  };

  getOneTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await taskServices.getTask(id);
    res.send(task);
  };

  updateTask = async (req: Request, res: Response) => {
    const task = await taskServices.updateTask(req.body);
    res.send(task);
  };

  updateManyTasks = async (req: Request, res: Response) => {
    const tasks = taskServices.updateManyTasks(req.body);

    res.send(tasks);
  };

  getTasksByUser = async (req: Request, res: Response) => {
    const tasks = await taskServices.getTasksByUser(req.params.id);
    res.send(tasks);
  };

  getTasksByProject = async (req: Request, res: Response) => {
    const tasks = await taskServices.getTasksByProject(req.params.id);
    res.send(tasks);
  };

  removeUserFromTasks = async (req: Request, res: Response) => {
    const tasks = await taskServices.removeUserFromTasks(
      req.body.projectId,
      req.body.userId
    );
    res.send(tasks);
  };

  deleteTask = async (req: Request, res: Response) => {
    const id = req.query.id;
    await taskServices.deleteTask(id as string);

    res.send("Task deleted");
  };
}

export const TaskController = new taskController();
