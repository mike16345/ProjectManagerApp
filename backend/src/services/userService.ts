import { User } from "../models/userModel";

export class UserService {
  async createUser(data: any) {
    try {
      const newUser = await User.create(data);

      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers() {
    try {
      const users = await User.find({});
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(id: string) {
    try {
      const user = await User.findById({ _id: id });
      if (!user) {
        return "User not available";
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return "User not available";
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateUser(id: string, data: any) {
    try {
      const user = await User.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      });

      if (!user) {
        return "User not available";
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return "user not available";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const userServices = new UserService();
