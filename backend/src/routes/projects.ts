import express from "express";
import { ProjectController } from "../controllers/projectController";

const router = express.Router();

// Add Project
router.post("/add", ProjectController.addProject);

// Delete Project
router.delete("/delete", ProjectController.deleteProject);

// Update Project
router.put("/edit", ProjectController.updateProject);

// Update many projects
router.put("/edit/bulk", ProjectController.updateManyProjects);

// Remove User from Project
router.put("/user", express.json(), ProjectController.removeUserFromProject);

// Get all projects
router.get("/getItems", ProjectController.getProjects);

// Get one project
router.get("/getItem/:id", ProjectController.getOneProject);

// Get user's projects
router.get("/byUser/getItems/:id", ProjectController.getProjectsByUser);

export default router;
