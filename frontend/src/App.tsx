import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUsersStore } from "./store/usersStore";
import { When } from "react-if";
import { CreateProjectPage } from "./components/Pages/Project/CreateProjectPage";
import { useProjectsStore } from "./store/projectsStore";
import { Toaster } from "./components/ui/toaster";
import { refreshData } from "./requests/dataRefresher";

import LoginPage from "./components/Pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import ProjectOverview from "./components/Pages/Project/ProjectOverview";
import MyTasksPage from "./components/Pages/MyTasksPage/MyTasksPage";
import AllProjectPage from "./components/Pages/Project/AllProjectsPage/AllProjectsPage";
import AdminPage from "./components/Pages/Admin/AdminPage";
import RequireAuth from "./Authentication/RequireAuth";
import useAuth from "./Authentication/useAuth";
import secureLocalStorage from "react-secure-storage";
import "./App.css";
import { userRequests } from "./requests/UserRequests";
import { HomePage } from "./components/Pages/Home/HomePage";

function App() {
  const { authed } = useAuth();

  const { activeUser, setActiveUser } = useUsersStore();
  const { setActiveProject } = useProjectsStore();

  const initData = async () => {
    refreshData();
    const userToken = secureLocalStorage.getItem("user-token");
    const activeProject = secureLocalStorage.getItem("active-project");

    if (userToken) {
      const user = await userRequests.verifyToken(userToken as string);
      setActiveUser(user);
    }

    if (activeProject) {
      setActiveProject(JSON.parse(activeProject as string));
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <div>
      <When condition={authed}>
        <Navbar />
      </When>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authed ? <Navigate to={"/home"} /> : <LoginPage />}
        />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <When condition={activeUser?.isAdmin}>
                <AdminPage />
              </When>
            </RequireAuth>
          }
        />
        <Route
          path="/createProject"
          element={
            <RequireAuth>
              <CreateProjectPage />
            </RequireAuth>
          }
        />
        <Route
          path="/project_overview"
          element={
            <RequireAuth>
              <ProjectOverview />
            </RequireAuth>
          }
        />
        <Route
          path="/myTasks"
          element={
            <RequireAuth>
              <MyTasksPage />
            </RequireAuth>
          }
        />

        <Route
          path="/allProjects"
          element={
            <RequireAuth>
              <AllProjectPage />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
