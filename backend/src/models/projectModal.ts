import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

interface IProject extends Document {
  id: string;
  projectLead: object;
  users: Array<object>;
  deadline: object;
  projectType: string;
  name: string;
  description: string;
  date_created: Date;
}

const projectSchema: Schema<IProject> = new Schema({
  id: String,
  projectLead: Object,
  projectType: String,
  users: Array,
  name: String,
  description: String,
  deadline: {
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
  },
  date_created: { type: Date, default: Date.now },
});

export const ProjectsModel = mongoose.model<IProject>(
  "projects",
  projectSchema
);

export const validateProject = (
  reqBody: Record<string, any>
): Joi.ValidationResult => {
  console.log("reqBody:", reqBody);
  const joiSchema = Joi.object({
    id: Joi.string(),
    projectType: Joi.string(),
    name: Joi.string().required(),
    projectLead: Joi.object(),
    deadline: Joi.object(),
    description: Joi.string(),
    users: Joi.array(),
  });
  return joiSchema.validate(reqBody);
};
