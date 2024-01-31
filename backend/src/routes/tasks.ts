import express, { Request, Response } from "express";
import { removeUserFromTasks } from "../services/taskService";
const router = express.Router();

import { Task } from "../models/taskModel";
import { TaskController } from "../controllers/taskController";

// Add Task
router.post("/add", TaskController.addTask);

// Get All Tasks
router.get("/getItems", TaskController.getTasks);

// Get Tasks by projects
router.get("/byProject/getItems/:id", TaskController.getTasksByProject);

// Get Tasks by User
router.get("/byUser/getItems/:id", TaskController.getTasksByUser);

// Update Task
router.put("/edit", TaskController.updateTask);

// Update many tasks
router.put("/edit/bulk", TaskController.updateManyTasks);

// Delete Task
router.delete("/delete", TaskController.deleteTask);

// Remove user from tasks
router.put("/assignee", express.json(), TaskController.removeUserFromTasks);

router.get("/byProjectId/:id", async (req: Request, res: Response) => {
  const allTasks = await Task.find({ project_id: req.params.id });
  res.json(allTasks);
});

router.get("/byEmail/:email", async (req: Request, res: Response) => {
  const allTasks = await Task.find({ email: req.params.email });
  res.json(allTasks);
});

export default router;
