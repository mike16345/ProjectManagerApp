import { Schema, model } from "mongoose";
import { ITask } from "../interfaces";
import Joi from "joi";

const taskSchema: Schema<ITask> = new Schema({
  name: String,
  description: { type: String, required: false },
  assignee: { type: Object, required: false },
  priority: String,
  status: String,
  project_id: String,
  date_created: {
    type: Date,
    default: Date.now,
  },
});

export const TaskSchemaValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  assignee: Joi.object().optional().allow(null),

  description: Joi.string().optional().allow(""),

  priority: Joi.string().min(2).max(100).required(),

  status: Joi.string().min(2).max(15).required(),

  project_id: Joi.string().required(),
});

export const Task = model("tasks", taskSchema);
