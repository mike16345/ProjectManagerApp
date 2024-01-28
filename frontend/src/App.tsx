import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import {
  verifyToken,
  getAllEmails,
  getAllUsers,
  editUser,
} from "./API/UserAPIcalls";
import LoginPage from "./components/Pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import ProjectOverview from "./components/Pages/Project/ProjectOverview";
import MyTasksPage from "./components/Pages/MyTasksPage/MyTasksPage";
import AllProjectPage from "./components/Pages/Project/AllProjectsPage/AllProjectsPage";
import { useUsersStore } from "./store/usersStore";
import { When } from "react-if";
import { CreateProjectPage } from "./components/Pages/Project/CreateProjectPage";
import { useProjectsStore } from "./store/projectsStore";
import { useTasksStore } from "./store/tasksStore";
import { getAllProjects } from "./API/ProjectAPIcalls";
import { getAllTasks } from "./API/TaskAPIcalls";
import AdminPage from "./components/Pages/AdminPage/AdminPage";
import RequireAuth from "./Authentication/RequireAuth";
import useAuth from "./Authentication/useAuth";
import secureLocalStorage from "react-secure-storage";
import "./App.css";
import { getImage, getImageNames } from "./utils/utils";
import { userInfo } from "os";

function App() {
  const { activeUser, users, setActiveUser, setUserEmails, setUsers } =
    useUsersStore();
  const { authed } = useAuth();

  const { setProjects, setActiveProject } = useProjectsStore();
  const { setTasks } = useTasksStore();

  const initData = async () => {
    const projects = await getAllProjects();
    const tasks = await getAllTasks();
    const users = await getAllUsers();
    const userEmails = await getAllEmails();
    console.log(tasks);
    const userToken = secureLocalStorage.getItem("user-token");
    const activeProject = secureLocalStorage.getItem("active-project");

    setProjects(projects);
    setTasks(tasks);
    setUsers(users);
    setUserEmails(userEmails);

    if (userToken) {
      const response = await verifyToken(userToken as string);
      setActiveUser(response.data);
    }

    if (activeProject) {
      setActiveProject(JSON.parse(activeProject as string));
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
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
    </>
  );
}

export default App;
