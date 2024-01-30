import { Project } from "../models/projectModel";
import { User } from "../models/userModel";

export class ProjectService {
  async createProject(data: any) {
    try {
      const newProject = await Project.create(data);

      return newProject;
    } catch (error) {
      console.log(error);
    }
  }

  async getProjects() {
    try {
      const projects = await Project.find({});
      return projects;
    } catch (error) {
      console.log(error);
    }
  }

  async getProject(id: string) {
    try {
      const project = await Project.findById({ _id: id });
      if (!project) {
        return "Project not available";
      }

      return project;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProject(data: any) {
    try {
      const project = await Project.findByIdAndUpdate({ _id: data._id }, data, {
        new: true,
      });

      if (!project) {
        return "Project not available";
      }

      return project;
    } catch (error) {
      console.log(error);
    }
  }

  async updateManyProjects(data: any[]) {
    try {
      const updatedProjects = await Promise.all(
        data.map(async (proj) => {
          return await this.updateProject(proj);
        })
      );

      return updatedProjects;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserProjects(id: string) {
    try {
      const projects = await Project.find({ "users._id": id });
      
      return projects;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProject(id: string) {
    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return "project not available";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const projectServices = new ProjectService();
