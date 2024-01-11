import React from "react";
import { Project, User } from "../interfaces";
interface AppContextType {
  userEmails: string[];
  userLogged: User | null;
  currentProject: Project | null;
}
const AppContext = React.createContext<AppContextType>({
  userEmails: [],
  userLogged: null,
  currentProject: null,
});

export default AppContext;
