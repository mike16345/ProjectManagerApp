const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  googleId: String,
  projects: [],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
});

exports.googleUserModel = mongoose.model("google-user", userSchema);

exports.genToken = (id) => {
  const token = jwt.sign({ id: id }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

exports.validateUser = (reqBody) => {
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
