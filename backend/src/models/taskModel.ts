import { Schema } from "mongoose";
import { ITask } from "../interfaces";
import mongoose from "mongoose";
import Joi from "joi";

const taskSchema: Schema<ITask> = new Schema({
  name: String,
  description: String,
  assignee: String,
  task_id: Number,
  priority: String,
  status: String,
  project_id: String,
});

export const TaskModel = mongoose.model("tasks", taskSchema);

export const validateTask = (reqBody: any) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    assignee: Joi.string().min(2).max(100).required().email(),
    description: Joi.string().min(10).max(250),
    task_id: Joi.number().min(2).required(),
    priority: Joi.string().min(2).max(100).required(),
    status: Joi.string().min(2).max(15).required(),
    project_id: Joi.string().required(),
  });
  return joiSchema.validate(reqBody);
};
