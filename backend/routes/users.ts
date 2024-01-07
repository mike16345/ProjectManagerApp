import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, genToken } from "../models/userModel";
import { authToken } from "../auth/authToken";
import { passwordModel } from "../models/passwordModel";

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const data = await UserModel.find({});
  res.json(data);
});

router.get("/one/:email", async (req: Request, res: Response) => {
  const data = await UserModel.findOne({ email: req.params.email });
  res.json(data);
});

router.get("/emails", async (req: Request, res: Response) => {
  const data = await UserModel.find({}, { email: 1 });
  res.json(data);
});

router.post("/register", async (req: Request, res: Response) => {
  const isUserExist = await UserModel.findOne({ email: req.body.email });

  if (isUserExist) {
    const token = genToken(isUserExist._id);

    return res.status(401).json({
      isNew: false,
      status: 203,
      token: token,
      error: "the email is already exist",
    });
  } else {
    try {
      const user = new UserModel(req.body);
      await user.save();
      const oldUser = await UserModel.findOne({ email: req.body.email });
      if (!oldUser) return;
      if (req.body.type === "local") {
        const password = await bcrypt.hash(req.body.password, 10);
        const newPassword = new passwordModel({
          _id: oldUser._id,
          password: password,
        });
        await newPassword.save();
      }
      const newToken = genToken(user._id);

      return res.json({ isNew: true, status: "registered", data: newToken });
    } catch (error) {
      res.status(400).json({ error: "did not work" });
    }
  }
});

router.put("/:idEdit", async (req: Request, res: Response) => {
  try {
    const data = await UserModel.updateOne(
      { _id: req.params.idEdit },
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: "error", data: "invalid username" });
  }

  const passwordObj = await passwordModel.findOne({ _id: user._id });
  if (!passwordObj) return;

  if (await bcrypt.compare(password, passwordObj.password)) {
    const newToken = genToken(user._id);

    return res.json({ status: "ok", data: newToken });
  } else {
    return res.json({ status: "error", data: "invalid password or email" });
  }
});

router.get("/tokenLogin", authToken, async (req: Request, res: Response) => {
  const user = await UserModel.findOne(
    { _id: req.tokenData.id },
    { password: 0 }
  );

  res.json(user);
});

export default router;
