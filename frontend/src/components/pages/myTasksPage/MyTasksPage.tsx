import React, {  useContext, useEffect, useState } from "react";
import classes from "./MyTasksPage.module.css";
import { getTasksByEmail } from "../../../API/TaskAPIcalls";
import Task from "../../task/Task";
import AppContext from "../../../context/context";

import {
  getAllProjects,
  getProjectsByUser,
} from "../../../API/ProjectAPIcalls";

const MyTasksPage: React.FC = (props) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const context = useContext(AppContext);

  const fetchMyProjects = async () => {
    if (!context.userLogged) return;
    const res = await getProjectsByUser(context.userLogged);
    setProjects(res);
  };

  const getUsersTasks = async (email: string) => {
    const res = await getTasksByEmail(email);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchMyProjects();
    if (!context.userLogged) return;
    const email = context.userLogged.email;

    getUsersTasks(email);
  }, []);

  return (
    <div className=" flex items-center justify-start m-4">
      <div className=" text-xl font-bold ">My Tasks</div>
      <div>
        {projects.map((project, index) => (
          <div key={index}>
            <h2 className={classes.title}>{project.name}</h2>
            <>
              {tasks
                .filter((task) => task.project_id === project._id)
                .map((task, index) => (
                  <Task
                    taskNumber={task.project_id}
                    style={"third"}
                    key={index}
                    taskText={task.text}
                    assignee={task.email}
                    priority={task.priority}
                    status={task.status}
                    isMyTasks={true}
                  />
                ))}
            </>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasksPage;
