import { Schema, Document } from "mongoose";
import { IUser } from "../interfaces";
import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";
interface IUserDocument extends Document, IUser {}

const userSchema: Schema<IUserDocument> = new Schema({
  name: String,
  email: String,
  type: String,
  projects: Array,
  picture:String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

export const UserModel = mongoose.model("users", userSchema);

export const genToken = (id: string) => {
  const token = jwt.sign({ id: id }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

export const validateLogin = (reqBody: any) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(2).max(25).required().email(),
  });

  return joiSchema.validate(reqBody);
};