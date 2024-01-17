import { create } from "zustand";
import { IUser } from "../interfaces";

interface IUsersStore {
  users: IUser[];
  activeUser: IUser | null;
  userEmails: string[];
  setActiveUser: (user: IUser) => void;
  setUserEmails: (emails: string[]) => void;
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
