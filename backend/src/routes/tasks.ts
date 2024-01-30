import express, { Request, Response } from "express";
import { removeUserFromTasks } from "../services/taskService";
const router = express.Router();

import { Task } from "../models/taskModel";
import { TaskController } from "../controllers/taskController";

// Add Task
router.post("/", TaskController.addTask);

// Get All Tasks
router.get("/", TaskController.getTasks);

// Update Task
router.put("/:id", TaskController.updateTask);

// Delete Task
router.delete("/:id", TaskController.deleteTask);

router.delete("/project/:id", async (req: Request, res: Response) => {
  const data = await removeUserFromTasks(
    req.params.id,
    (req.body as any).email
  );

  res.send(data);
});

router.get("/byProjectId/:id", async (req: Request, res: Response) => {
  const allTasks = await Task.find({ project_id: req.params.id });
  res.json(allTasks);
});

router.get("/byEmail/:email", async (req: Request, res: Response) => {
  const allTasks = await Task.find({ email: req.params.email });
  res.json(allTasks);
});

export default router;
