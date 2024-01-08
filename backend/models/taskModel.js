const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
  text: String,
  email: String,
  task_id: Number,
  priority: String,
  status: String,
  project_id: String,
});

exports.TaskModel = mongoose.model("tasks", taskSchema);

exports.validateTask = (reqBody) => {
  const joiSchema = Joi.object({
    text: Joi.string().min(2).max(100).required(),
    email: Joi.string().min(2).max(100).required().email(),
    task_id: Joi.number().min(2).required(),
    priority: Joi.string().min(2).max(100).required(),
    status: Joi.string().min(2).max(15).required(),
    project_id: Joi.string().required(),
  });
  return joiSchema.validate(reqBody);
};
