import React from "react";

const AppContext = React.createContext({
  userEmails: [],
  userLogged: null,
  currentProject: {},
});

export default AppContext;
