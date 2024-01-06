const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

const { googleUserModel, genToken } = require("../models/googleUserModel");
const { authToken } = require("../auth/authToken");

router.get("/", async (req, res) => {
  const data = await googleUserModel.find({});
  res.json(data);
});

router.get("/one/:googleId", async (req, res) => {
  const data = await googleUserModel.findOne({ googleId: req.params.googleId });

  res.json(data);
});

router.get("/emails", async (req, res) => {
  const data = await googleUserModel.find({}, { email: 1 });

  res.json(data);
});

router.post("/login", async (req, res) => {
  const isFoundUser = await googleUserModel.exists({
    email: req.body.user.email,
  });

  try {
    const newToken = genToken(req.body.user.googleId);

    if (!isFoundUser) {
      const user = new googleUserModel(req.body.user);
      await user.save();

      return res.json({ isNew: true, status: "registered", data: newToken });
    } else {
      return res.json({ status: "ok", data: newToken, isNew: false });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "did not work" });
  }
});

router.put("/:idEdit", async (req, res) => {
  // const validBody = validateUser(req.body);
  // if (validBody.error) {
  //   return res.status(401).json(validBody.error.details);
  // }
  try {
    const data = await googleUserModel.updateOne(
      { _id: req.params.idEdit },
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get("/tokenLogin", authToken, async (req, res) => {
  const user = await googleUserModel.findOne({
    googleId: req.tokenData.id,
  });

  res.json(user);
});

module.exports = router;
