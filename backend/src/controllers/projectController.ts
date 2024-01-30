import { projectServices } from "../services/projectService";
import { Request, Response } from "express";
import { ProjectSchemaValidation } from "../models/projectModel";
import { IProject } from "../interfaces";

class projectController {
  addProject = async (req: Request, res: Response) => {
    const data = {
      name: req.body.name,
      projectLead: req.body.projectLead,
      users: req.body.users,
      deadline: req.body.deadline,
      projectType: req.body.projectType,
      description: req.body.description,
    };

    const { error, value } = ProjectSchemaValidation.validate(data);

    if (error) {
      res.send(error.message);
    } else {
      const project = await projectServices.createProject(value);
      res.status(201).send(project);
    }
  };

  getProjects = async (req: Request, res: Response) => {
    const projects = await projectServices.getProjects();
    res.send(projects);
  };

  getOneProject = async (req: Request, res: Response) => {
    const id = req.params.id;
    const project = await projectServices.getProject(id);
    res.send(project);
  };

  updateProject = async (req: Request, res: Response) => {
    const id = req.params.id;
    const project = await projectServices.updateProject(id, req.body);
    res.send(project);
  };

  deleteProject = async (req: Request, res: Response) => {
    const id = req.params.id;
    await projectServices.deleteProject(id);

    res.send("Project deleted");
  };
}

export const ProjectController = new projectController();
