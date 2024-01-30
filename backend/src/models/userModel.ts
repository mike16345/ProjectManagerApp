import { Schema, Document, model } from "mongoose";
import { IUser } from "../interfaces";
import Joi from "joi";
import jwt from "jsonwebtoken";

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

const userSchema: Schema<IUser> = new Schema({
  id: String,
  name: String,
  email: String,
  type: String,
  projects: Array,
  picture: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

export const User = model("users", userSchema);

export const genToken = (id: string) => {
  const token = jwt.sign({ id: id }, JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

export const UserSchemaValidation = Joi.object({
  id: Joi.string(),
  name: Joi.string().min(2).max(25).required(),
  email: Joi.string().min(2).max(30).required().email(),
});
