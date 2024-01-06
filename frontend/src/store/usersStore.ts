import { create } from "zustand";
import { User } from "../interfaces";

interface IUsersStore {
  activeUser: User | null;
  userEmails: string[];
  setActiveUser: (user: User) => void;
  setUserEmails: (emails: string[]) => void;
}

export const useUsersStore = create<IUsersStore>((set, get) => ({
  activeUser: null,
  userEmails: [],
  setActiveUser: (user) => {
    set({ activeUser: user });
  },
  setUserEmails: (emails) => {
    set({ userEmails: emails });
  },
}));
