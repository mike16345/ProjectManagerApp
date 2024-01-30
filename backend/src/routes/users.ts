import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, genToken } from "../models/userModel";
import { authToken } from "../auth/authToken";
import { Password } from "../models/passwordModel";
import { UserController } from "../controllers/userController";

const router = express.Router();

// Get all users
router.get("/getItems", UserController.getUsers);

// Update user
router.put("/edit/", UserController.updateUser);

// Update user
router.put("/edit/bulk", UserController.updateManyUsers);

// Get user by id
router.get("/getItem/:id", UserController.getUser);

//Delete user
router.delete("/:id", UserController.deleteUser);

// Get user by email
router.get("/byEmail/getItem/:email", UserController.getUserByEmail);

router.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    if (req.body.type === "local") {
      const password = await bcrypt.hash(req.body.password, 10);

      await Password.create({
        _id: user._id,
        password: password,
      });
    }

    const newToken = genToken(user._id.toString());

    return res.json({ isNew: true, status: "registered", data: newToken });
  } catch (error) {
    res.status(400).json({ error: "did not work" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ status: "error", data: "Invalid Email!" });
  }
  const passwordObj = await Password.findOne({ _id: user._id });

  if (!passwordObj) return;

  if (await bcrypt.compare(password, passwordObj.password)) {
    const newToken = genToken(user._id.toString());

    return res.json({
      status: "ok",
      user: user,
      token: newToken,
      isNew: false,
    });
  } else {
    return res.json({ status: "error", data: "Invalid password!" });
  }
});

router.get("/tokenLogin", authToken, async (req: Request, res: Response) => {
  console.log("here");
  const user = await User.findOne({ _id: req.tokenData.id }, { password: 0 });
  console.log("user:", user);
  return res.json(user);
});

export default router;
