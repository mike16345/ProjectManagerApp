import express, { Request, Response } from "express";
import { removeUserFromTasks } from "../services/taskService";
const router = express.Router();

import { TaskModel, validateTask } from "../models/taskModel";

router.get("/", async (req: Request, res: Response) => {
  const data = await TaskModel.find({});
  res.json(data);
});

router.post("/", async (req: Request, res: Response) => {
  const validBody = validateTask(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const data = new TaskModel(req.body);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: "did not work" });
  }
});

router.put("/:idEdit", async (req: Request, res: Response) => {
  const validBody = validateTask(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try {
    const data = await TaskModel.updateOne(
      { task_id: req.params.idEdit },
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.delete("/project/:id", async (req: Request, res: Response) => {
  const data = await removeUserFromTasks(
    req.params.id,
    (req.body as any).email
  );

  res.send(data);
});

router.get("/byProjectId/:id", async (req: Request, res: Response) => {
  const allTasks = await TaskModel.find({ project_id: req.params.id });
  res.json(allTasks);
});

router.get("/byEmail/:email", async (req: Request, res: Response) => {
  const allTasks = await TaskModel.find({ email: req.params.email });
  res.json(allTasks);
});

router.delete("/:idDel", async (req: Request, res: Response) => {
  const data = await TaskModel.deleteOne({ task_id: req.params.idDel });
  res.json(data);
});

export default router;
