import { Schema, model } from "mongoose";
import { ITask } from "../interfaces";
import Joi from "joi";

const taskSchema: Schema<ITask> = new Schema({
  name: String,
  description: String,
  assignee: Object,
  task_id: Number,
  priority: String,
  status: String,
  project_id: String,
});

export const TaskSchemaValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  assignee: Joi.object().optional(),

  description: Joi.string().max(250),

  task_id: Joi.number().min(2).required(),

  priority: Joi.string().min(2).max(100).required(),

  status: Joi.string().min(2).max(15).required(),

  project_id: Joi.string().required(),
});

export const Task = model("tasks", taskSchema);
