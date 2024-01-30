import express, { Request, Response } from "express";
import { Project, ProjectSchemaValidation } from "../models/projectModel";
import { User } from "../models/userModel";
import { ProjectController } from "../controllers/projectController";

const router = express.Router();

// Add Project
router.post("/", ProjectController.addProject);

// Delete Project
router.delete("/:id", ProjectController.deleteProject);

// Update Project
router.put("/:id", ProjectController.updateProject);

// Get all projects
router.get("/", ProjectController.getProjects);

// Get one project
router.get("/:id", ProjectController.getOneProject);

// Get all projects for a user
router.get("/perUser/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return;
    const projects_ar = await Promise.all(
      user.projects.map(async (projectId) => {
        return await Project.findOne({ _id: projectId });
      })
    );
    res.json(projects_ar);
  } catch (error) {
    res.status(400).json({ error: error, msg: "user id not found" });
  }
});

// Add user to project
router.put("/addUser/:idEdit", async (req: Request, res: Response) => {
  const validBody = ProjectSchemaValidation.validate(req.body);

  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }

  try {
    const data = await Project.updateOne({ _id: req.params.idEdit }, req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;
