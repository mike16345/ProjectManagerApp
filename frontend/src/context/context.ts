import React from "react";
import { IProject, IUser } from "../interfaces";
interface AppContextType {
  userEmails: string[];
  userLogged: IUser | null;
  currentProject: IProject | null;
}
const AppContext = React.createContext<AppContextType>({
  userEmails: [],
  userLogged: null,
  currentProject: null,
});

export default AppContext;
