import React, { useEffect, useState } from "react";
import { getTasksByEmail } from "../../../API/TaskAPIcalls";
import Task from "../../Task/Task";

import { getProjectsByUser } from "../../../API/ProjectAPIcalls";
import { useUsersStore } from "../../../store/usersStore";
import { IProject, ITask } from "../../../interfaces";
import { Text } from "@chakra-ui/react";

const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
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
    <div className=" flex flex-col  gap-4 justify-start m-4">
      <div className=" text-2xl font-extrabold ">My Tasks</div>
      <div className="flex flex-col gap-12">
        {projects
          .filter((project) =>
            tasks.some((task) => task.project_id === project._id)
          )
          .map((project, index) => (
            <div key={index}>
              <div className="flex flex-col">
                <Text className=" text-xl font-semibold">
                  Project: {project.name}
                </Text>
                <div className="flex flex-wrap  gap-6 border p-3">
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
