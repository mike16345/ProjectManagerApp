import { model, Schema } from "mongoose";
import Joi from "joi";
import { IProject } from "../interfaces";

export const ProjectSchemaValidation = Joi.object({
  id: Joi.string(),

  projectType: Joi.string(),

  name: Joi.string().min(2).required(),

  projectLead: Joi.object(),

  deadline: Joi.object().optional(),

  description: Joi.string(),

  users: Joi.array(),
});

const projectSchema: Schema<IProject> = new Schema({
  id: String,
  projectLead: Object,
  projectType: String,
  users: Array,
  name: String,
  description: { String, required: false },
  deadline: {
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    required: false,
  },
  date_created: { type: Date, default: Date.now },
});

export const Project = model<IProject>("projects", projectSchema);
