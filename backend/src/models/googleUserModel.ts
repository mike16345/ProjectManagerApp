import { Schema, Document } from "mongoose";
import Joi from "joi";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces";

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

interface IGoogleUser extends Document, IUser {
  googleId: string;
}

const googleUserSchema: Schema<IGoogleUser> = new Schema({
  name: String,
  email: String,
  googleId: String,
  projects: Array,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

export const googleUserModel = mongoose.model<IGoogleUser>(
  "google-user",
  googleUserSchema
);

export const genToken = (id: string): string => {
  const token = jwt.sign({ id: id }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

export const validateUser = (
  reqBody: Record<string, any>
): Joi.ValidationResult => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().min(2).max(25).required().email(),
    googleId: Joi.string().min(2).max(100).required(),
    isAdmin: Joi.boolean(),
    projects: Joi.array(),
    _id: Joi.string(),
    __v: Joi.number(),
  });

  return joiSchema.validate(reqBody);
};
