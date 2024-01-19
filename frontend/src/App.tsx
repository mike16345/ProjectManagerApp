import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { verifyToken, getAllEmails } from "./API/UserAPIcalls";
import LoginPage from "./components/Pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import ProjectOverview from "./components/Pages/Project/ProjectOverview";
import WelcomePage from "./components/pages/welcomePage/WelcomePage";
import MyTasksPage from "./components/Pages/MyTasksPage/MyTasksPage";
import AllProjectPage from "./components/Pages/AllProjectsPage/AllProjectsPage";
import { useUsersStore } from "./store/usersStore";
import { When } from "react-if";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const { activeUser, setActiveUser, setUserEmails } = useUsersStore();

  const loginOnToken = async (isNew: boolean) => {
    const token = localStorage.getItem("token-promger");
    if (!token) return;

    const response = await verifyToken(token);
    response.data.isNew = isNew;

    setIsNewUser(isNew);
    setActiveUser(response.data);
    setIsLoggedIn(true);
    saveAllEmails();

    navigate("welcome");

    const timer = setTimeout(() => {
      navigate("allProjects");
    }, 800);

    return () => clearTimeout(timer);
  };

  const onLogOutHandler = () => {
    localStorage.removeItem("token-promger");
    setIsLoggedIn(false);
    navigate("/");
  };

  const saveAllEmails = async () => {
    const emails = await getAllEmails();
    if (emails) setUserEmails(emails);
  };

  useEffect(() => {
    loginOnToken(false);
  }, []);

  return (
    <div className="w-full h-full">
      <When condition={isLoggedIn}>
        <Navbar onLogOutHandler={onLogOutHandler} isLoggedIn={isLoggedIn} />
      </When>
      <Routes>
        <Route path="/" element={<LoginPage loginOnToken={loginOnToken} />} />
        <Route
          path="welcome"
          element={
            <WelcomePage
              name={activeUser ? activeUser.name : "User"}
              isNew={isNewUser}
            />
          }
        />
        <Route
          path="project_overview"
          element={isLoggedIn && <ProjectOverview />}
        />
        <Route path="myTasks" element={isLoggedIn && <MyTasksPage />} />
        <Route path="allProjects" element={isLoggedIn && <AllProjectPage />} />
      </Routes>
    </div>
  );
}

export default App;
