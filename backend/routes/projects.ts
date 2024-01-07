import express, { Request, Response } from "express";
const router = express.Router();

import { ProjectsModel, validateProject } from "../models/projectModal";
import { UserModel } from "../models/userModel";

router.get("/", async (req: Request, res: Response) => {
  const data = await ProjectsModel.find();
  res.json(data);
});

router.get("/:id", async (req: Request, res: Response) => {
  const data = await ProjectsModel.findOne({ _id: req.params.id });
  res.json(data);
});

router.get("/perUser/:id", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user) return;
    const projects_ar = await Promise.all(
      user.projects.map(async (projectId) => {
        return await ProjectsModel.findOne({ _id: projectId });
      })
    );
    res.json(projects_ar);
  } catch (error) {
    res.status(400).json({ error: error, msg: "user id not found" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const validBody = validateProject(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try {
    const data = new ProjectsModel(req.body);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: "did not work" });
  }
});

router.put("/addUser/:idEdit", async (req: Request, res: Response) => {
  const validBody = validateProject(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try {
    const data = await ProjectsModel.updateOne(
      { _id: req.params.idEdit },
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;
