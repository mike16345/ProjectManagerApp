import { useEffect, useState, Fragment, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  verifyToken,
  getAllEmails,
  verifyTokenWithGoogle,
} from "./API/UserAPIcalls";
import AppContext from "./context/context";

import LoginPage from "./components/pages/loginPage/LoginPage";
import Navbar from "./components/navbar/Navbar";
import ProjectOverview from "./components/pages/projectOverview/ProjectOverview";

import "./App.css";
import WelcomePage from "./components/pages/welcomePage/WelcomePage";
import MyTasksPage from "./components/pages/myTasksPage/MyTasksPage";
import AllProjectPage from "./components/pages/allProjectsPage/AllProjectsPage";
import { gapi } from "gapi-script";

let userInfo = {};

function App() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [isLoggedIn, setIsLoggenIn] = useState(false);

  // const clientId = process.env.REACT_APP_CLIENT_ID;

  const loginOnToken = async (isNew: boolean) => {
    const token = localStorage.getItem("token-promger");
    console.log("log in on token");

    if (token) {
      const response = await verifyToken(token);

      userInfo = response.data;
      userInfo.isNew = isNew;
      setIsLoggenIn(true);
      context.userLogged = userInfo;
      navigate("welcome");
      const timer = setTimeout(() => {
        navigate("allProjects");
      }, 800);
      return () => clearTimeout(timer);
    } else {
      console.log("token not available");
    }
  };

  useEffect(() => {
    // const initClient = () => {
    //   gapi.auth2.init({ clientId: clientId });
    //   gapi.load("client:auth2", initClient);
    // };
    // loginOnToken(false, "");
  }, []);

  const onLogOutHandler = () => {
    console.log("logging out");
    localStorage.removeItem("token-promger");
    setIsLoggenIn(false);
    navigate("/");
  };

  const onLogInHandler = () => {
    setIsLoggenIn(true);
  };

  const saveAllEmails = async () => {
    context.userEmails = await getAllEmails();
  };

  if (isLoggedIn) {
    saveAllEmails();
  }

  return (
    <Fragment>
      <AppContext.Provider value={context}>
        <Navbar
          logOut={onLogOutHandler}
          userInfo={userInfo}
          loggedIn={isLoggedIn}
        />
        <Routes>
          <Route
            index
            element={
              <LoginPage
                loginOnToken={loginOnToken}
                isLoggedIn={isLoggedIn}
                onLogin={onLogInHandler}
              />
            }
          />
          <Route
            path="welcome"
            element={
              <WelcomePage name={userInfo.name} isNew={userInfo.isNew} />
            }
          />
          <Route
            path="project_overview"
            element={isLoggedIn && <ProjectOverview />}
          />
          <Route path="myTasks" element={isLoggedIn && <MyTasksPage />} />
          <Route path="allProjects" element={<AllProjectPage />} />
        </Routes>
      </AppContext.Provider>
    </Fragment>
  );
}

export default App;
