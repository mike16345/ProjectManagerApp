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
  setUsers: (users: IUser[]) => void;
  setActiveUser: (user: IUser) => void;
  setUserEmails: (emails: IEmail[]) => void;
}

export const useUsersStore = create<IUsersStore>((set, get) => ({
  users: [],
  activeUser: null,
  userEmails: [],
  setUsers: (users) => {
    set({ users: users });
  },
  setActiveUser: (user) => {
    set({ activeUser: user });
  },
  setUserEmails: (emails) => {
    set({ userEmails: emails });
  },
}));
