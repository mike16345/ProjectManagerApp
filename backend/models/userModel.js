const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: String,
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

exports.UserModel = mongoose.model("users", userSchema);

exports.genToken = (id) => {
  const token = jwt.sign({ id: id }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

exports.validateLogin = (reqBody) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(2).max(25).required().email(),
  });

  return joiSchema.validate(reqBody);
};
