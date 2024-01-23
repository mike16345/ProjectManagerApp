import React, { useEffect, useState } from "react";
import { getTasksByEmail } from "../../../API/TaskAPIcalls";
import Task from "../../Task/Task";

import {
  getAllProjects,
  getProjectsByUser,
} from "../../../API/ProjectAPIcalls";
import { useUsersStore } from "../../../store/usersStore";
import { ITask } from "../../../interfaces";

const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const { activeUser } = useUsersStore();
  const fetchMyProjects = async () => {
    if (!activeUser) return;
    const res = await getProjectsByUser(activeUser);
    setProjects(res);
  };

  const getUsersTasks = async (email: string) => {
    const res = await getTasksByEmail(email);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchMyProjects();
    if (!activeUser) return;
    getUsersTasks(activeUser.email);
  }, []);

  return (
    <div className=" flex flex-col  justify-start m-4">
      <div className=" text-xl font-bold ">My Tasks</div>
      <div className="">
        {projects.map((project, index) => (
          <div key={index}>
            <div className=" flex flex-col">
              <h2 className="">{project.name}</h2>
              <div className=" flex gap-6 border p-2">
                {tasks
                  .filter((task) => task.project_id === project._id)
                  .map((task, index) => (
                    <Task
                      task={task}
                      setTaskToEdit={(task: ITask) => {}}
                      key={index}
                      isMyTasks={true}
                    />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasksPage;
