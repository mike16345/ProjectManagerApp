import { userServices } from "../services/userService";
import { Request, Response } from "express";
import { UserSchemaValidation } from "../models/userModel";
import { IUser } from "../interfaces";

class userController {
  addUser = async (req: Request, res: Response) => {
    const data = {
      name: req.body.name,
      userLead: req.body.userLead,
      users: req.body.users,
      deadline: req.body.deadline,
      userType: req.body.userType,
      description: req.body.description,
    };

    const { error, value } = UserSchemaValidation.validate(data);

    if (error) {
      res.send(error.message);
    } else {
      const user = await userServices.createUser(value);
      res.status(201).send(user);
    }
  };

  getUsers = async (req: Request, res: Response) => {
    const users = await userServices.getUsers();
    res.send(users);
  };

  getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await userServices.getUser(id);
    res.send(user);
  };

  getUserByEmail = async (req: Request, res: Response) => {
    const email = req.params.email;
    const user = await userServices.getUserByEmail(email);
    res.send(user);
  };

  updateUser = async (req: Request, res: Response) => {
    console.log("req", req);
    const user = await userServices.updateUser(req.body._id, req.body);
    res.send(user);
  };

  deleteUser = async (req: Request, res: Response) => {
    const id = req.query.id;
    console.log("id", id);
    const resp = await userServices.deleteUser(id as string);
    console.log("resp", resp);
    res.send("User deleted");
  };
}

export const UserController = new userController();
