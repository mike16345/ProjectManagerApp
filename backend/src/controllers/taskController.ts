import { taskServices } from "../services/taskService";
import { Request, Response } from "express";
import { TaskSchemaValidation } from "../models/taskModel";
import { ITask } from "../interfaces"; 

class taskController {
  addTask = async (req: Request, res: Response) => {
    const data = {
      name: req.body.name,
      taskLead: req.body.taskLead,
      users: req.body.users,
      deadline: req.body.deadline,
      taskType: req.body.taskType,
      description: req.body.description,
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
    const id = req.params.id;
    const task = await taskServices.updateTask(id, req.body);
    res.send(task);
  };

  deleteTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    await taskServices.deleteTask(id);

    res.send("Task deleted");
  };
}

export const TaskController = new taskController();
