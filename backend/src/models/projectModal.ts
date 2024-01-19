import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

interface IProject extends Document {
  id: string;
  users: Array<string>;
  name: string;
  date_created: Date;
}

const projectSchema: Schema<IProject> = new Schema({
  id: String,
  users: Array,
  name: String,
  date_created: { type: Date, default: Date.now },
});

export const ProjectsModel = mongoose.model<IProject>(
  "projects",
  projectSchema
);

export const validateProject = (
  reqBody: Record<string, any>
): Joi.ValidationResult => {
  const joiSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    users: Joi.array(),
  });
  return joiSchema.validate(reqBody);
};
