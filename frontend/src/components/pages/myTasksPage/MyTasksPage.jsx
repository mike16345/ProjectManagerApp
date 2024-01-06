import { Fragment, useContext, useEffect, useState } from "react";
import classes from "./MyTasksPage.module.css";
import { getTasksByEmail } from "../../../API/TaskAPIcalls";
import Task from "../../task/Task";
import BoxRow from "../../boxRow/BoxRow";
import AppContext from "../../../context/Context";

import {
  getAllProjects,
  getProjectsByUser,
} from "../../../API/ProjectAPIcalls";

const MyTasksPage = (props) => {
  const [tasks, setTasks] = useState([]);

  const [projects, setProjects] = useState([]);
  const context = useContext(AppContext);

  const fetchMyProjects = async () => {
    const res = await getProjectsByUser(context.userLogged);
    setProjects(res);
  };

  const getUsersTasks = async (email) => {
    const res = await getTasksByEmail(email);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchMyProjects();
    const email = context.userLogged.email;
    getUsersTasks(email);
  }, []);

  return (
    <Fragment>
      <h2 className={classes.title}>my tasks </h2>
      <div>
        {projects.map((project, index) => {
          {
            return (
              <div key={index}>
                <h2 className={classes.title}>{project.name}</h2>
                <BoxRow>
                  {tasks
                    .filter((task) => task.project_id === project._id)
                    .map((task, index) => (
                      <Task
                        style={"third"}
                        key={index}
                        taskText={task.text}
                        assignee={task.email}
                        priority={task.priority}
                        status={task.status}
                        isMyTasks={true}
                      />
                    ))}
                </BoxRow>
              </div>
            );
          }
        })}
      </div>
    </Fragment>
  );
};

export default MyTasksPage;
