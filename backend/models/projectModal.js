const mongoose = require("mongoose");
const Joi = require("joi");

const projectSchema = new mongoose.Schema({
  id: String,
  users: [],
  name: String,
  date_created: { type: Date, default: Date.now() },
});

exports.ProjectsModel = mongoose.model("projects", projectSchema);

exports.validateProject = (reqBody) => {
  const joiSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    users: Joi.array(),
  });
  return joiSchema.validate(reqBody);
};
