import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { verifyToken, getAllEmails, getAllUsers } from "./API/UserAPIcalls";
import LoginPage from "./components/Pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import ProjectOverview from "./components/Pages/Project/ProjectOverview";
import WelcomePage from "./components/Pages/WelcomePage/WelcomePage";
import MyTasksPage from "./components/Pages/MyTasksPage/MyTasksPage";
import AllProjectPage from "./components/Pages/Project/AllProjectsPage/AllProjectsPage";
import { useUsersStore } from "./store/usersStore";
import { When } from "react-if";
import "./App.css";
import { CreateProjectPage } from "./components/Pages/Project/CreateProjectPage";
import { useProjectsStore } from "./store/projectsStore";
import { useTasksStore } from "./store/tasksStore";
import { getAllProjects } from "./API/ProjectAPIcalls";
import { getAllTasks } from "./API/TaskAPIcalls";
import { useToast } from "@chakra-ui/react";
import AdminPage from "./components/Pages/AdminPage/AdminPage";
import secureLocalStorage from "react-secure-storage";
import RequireAuth from "./Authentication/RequireAuth";
import useAuth from "./Authentication/useAuth";

function App() {
  const { activeUser, setActiveUser, setUserEmails, setUsers } =
    useUsersStore();
  const { authed } = useAuth();

  const { setProjects } = useProjectsStore();
  const { setTasks } = useTasksStore();

  const initData = async () => {
    const projects = await getAllProjects();
    const tasks = await getAllTasks();
    const users = await getAllUsers();
    const userEmails = await getAllEmails();

    setProjects(projects);
    setTasks(tasks);
    setUsers(users);
    setUserEmails(userEmails);
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <div className="w-full h-full">
      <When condition={authed}>
        <Navbar />
      </When>
      <Routes>
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
          path="createProject"
          element={
            <RequireAuth>
              <CreateProjectPage />
            </RequireAuth>
          }
        />
        <Route
          path="project_overview"
          element={
            <RequireAuth>
              <ProjectOverview />
            </RequireAuth>
          }
        />
        <Route
          path="myTasks"
          element={
            <RequireAuth>
              <MyTasksPage />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={authed ? <Navigate to="/myTasks" /> : <LoginPage />}
        />
        <Route
          path="allProjects"
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
