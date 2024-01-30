import axios, { AxiosResponse } from "axios";
import { IUser } from "../interfaces";

const APIaddress = "http://localhost:3002/users";

interface AuthResponse {
  status?: string;
  isNew?: boolean;
  token?: string;
  user?: any;
}

export const loginHandler = async (userDetails: any): Promise<AuthResponse> => {
  try {
    const res: AxiosResponse = await axios.post(
      `${APIaddress}/login`,
      userDetails
    );
    return {
      isNew: res.data.isNew,
      user: res.data.user,
      token: res.data.token,
      status: res.data.status,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerHandler = async (user: any): Promise<AuthResponse> => {
  try {
    const res: AxiosResponse = await axios.post(`${APIaddress}/register`, user);

    return {
      isNew: res.data.isNew,
      status: res.data.status,
      token: res.data.data,
    } as AuthResponse;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.get(`${APIaddress}/tokenLogin`, {
      headers: { "x-api-key": token },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const res: AxiosResponse = await axios.get(`${APIaddress}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.get(`${APIaddress}/${email}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (id: string): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.get(`${APIaddress}/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (user: IUser): Promise<IUser> => {
  try {
    const res: AxiosResponse = await axios.put(
      `${APIaddress}/users/${user._id}`,
      user
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
