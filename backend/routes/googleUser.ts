import express, { Request, Response } from "express";
import { googleUserModel, genToken } from "../models/googleUserModel";
import { authToken } from "../auth/authToken";

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const data = await googleUserModel.find({});
  res.json(data);
});

router.get("/one/:googleId", async (req: Request, res: Response) => {
  const data = await googleUserModel.findOne({ googleId: req.params.googleId });
  res.json(data);
});

router.get("/emails", async (req: Request, res: Response) => {
  const data = await googleUserModel.find({}, { email: 1 });
  res.json(data);
});

router.post("/login", async (req: Request, res: Response) => {
  const isFoundUser = await googleUserModel.exists({
    email: (req.body as any).user.email,
  });

  try {
    const newToken = genToken((req.body as any).user.googleId);

    if (!isFoundUser) {
      const user = new googleUserModel((req.body as any).user);
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

router.put("/:idEdit", async (req: Request, res: Response) => {
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

router.get("/tokenLogin", authToken, async (req: Request, res: Response) => {
  const user = await googleUserModel.findOne({
    googleId: (req as any).tokenData.id,
  });

  res.json(user);
});

export default router;
