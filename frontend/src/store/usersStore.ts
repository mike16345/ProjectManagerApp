import { create } from "zustand";
import { IUser } from "../interfaces";

export interface IEmail {
  email: string;
  _id: string;
}
interface IUsersStore {
  users: IUser[];
  activeUser: IUser | null;
  userEmails: IEmail[];
  setActiveUser: (user: IUser) => void;
  setUserEmails: (emails: IEmail[]) => void;
}

export const useUsersStore = create<IUsersStore>((set, get) => ({
  users: [],
  activeUser: null,
  userEmails: [],
  setActiveUser: (user) => {
    set({ activeUser: user });
  },
  setUserEmails: (emails) => {
    set({ userEmails: emails });
  },
}));
