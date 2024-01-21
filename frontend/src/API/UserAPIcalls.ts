import axios, { AxiosError, AxiosResponse } from "axios";
import { IUser } from "../interfaces";
import { IEmail } from "../store/usersStore";

const APIaddress = "http://localhost:3002";

interface AuthResponse {
  isNew: boolean;
  status?: string;
  token?: string;
  data?: any;
}

export const loginHandler = async (userDetails: any): Promise<AuthResponse> => {
  try {
    const res: AxiosResponse = await axios.post(
      `${APIaddress}/users/login`,
      userDetails
    );

    return {
      isNew: false,
      data: await res.data,
    };
  } catch (error) {
    // Add No such user alert/ Register
    throw error;
  }
};

export const registerHandler = async (user: any): Promise<AuthResponse> => {
  try {
    const res: AxiosResponse = await axios.post(
      `${APIaddress}/users/register`,
      user
    );

    return {
      isNew: res.data.isNew,
      status: res.data.status,
      token: res.data.data,
    } as AuthResponse;
  } catch (error) {
    // Add error alert
    console.log("error:", error);
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.get(
      `${APIaddress}/users/tokenLogin`,
      {
        headers: { "x-api-key": token },
      }
    );
    return res;
  } catch (error) {
    // Add Error alert
    console.error(error);
    throw error;
  }
};

export const verifyTokenWithGoogle = async (
  token: string
): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.get(
      `${APIaddress}/googleUsers/tokenLogin`,
      {
        headers: { "x-api-key": token },
      }
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllEmails = async (): Promise<IEmail[]> => {
  try {
    const res: AxiosResponse = await axios.get(`${APIaddress}/users/emails`);

    let users: IEmail[] = res.data;

    const googleRes: AxiosResponse = await axios.get(
      `${APIaddress}/googleUsers/emails`
    );
    const googleUsers: IEmail[] = googleRes.data;

    users = [...users, ...googleUsers];

    return users;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const res: AxiosResponse = await axios.get(`${APIaddress}/users/`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const getOneUser = async (email: string): Promise<AxiosResponse> => {
  try {
    const res: AxiosResponse = await axios.get(
      `${APIaddress}/users/one/${email}`
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editUser = async (user: IUser): Promise<IUser> => {
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

export const editUserByEmail = async (user: IUser): Promise<IUser> => {
  try {
    const res: AxiosResponse = await axios.put(
      `${APIaddress}/users/one/${user.email}`,
      user
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async (user: IUser): Promise<any> => {
  const res: AxiosResponse = await axios.post(
    `${APIaddress}/googleUsers/login`,
    { user }
  );

  return res.data;
};
