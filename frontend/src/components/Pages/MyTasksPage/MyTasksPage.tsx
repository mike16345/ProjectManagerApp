import React, { useEffect, useState } from "react";
import Task from "../../Task/Task";
import { useUsersStore } from "../../../store/usersStore";
import { IProject, ITask } from "../../../interfaces";
import { BY_USER_ENDPOINT, projectRequests } from "@/requests/ProjectRequests";
import { taskRequests } from "@/requests/TaskRequests";

const MyTasksPage: React.FC = () => {
  const { activeUser } = useUsersStore();
  
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  
  const fetchMyProjects = async () => {
    if (!activeUser) return;

    await projectRequests
      .getItemsByRequest(activeUser._id, BY_USER_ENDPOINT)
      .then((projects) => {
        setProjects(projects);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUsersTasks = async () => {
    if (!activeUser) return;

    await taskRequests
      .getItemsByRequest(activeUser._id, BY_USER_ENDPOINT)
      .then((res) => setTasks(res))
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchMyProjects();
    getUsersTasks();
  }, []);

  return (
    <div className=" flex flex-col gap-4 justify-start m-4">
      <div className=" text-2xl font-extrabold ">My Tasks</div>
      <div className="flex flex-col gap-12">
        {projects
          .filter((project) =>
            tasks.some((task) => task.project_id === project._id)
          )
          .map((project, index) => (
            <div key={index}>
              <div className="flex flex-col">
                <p className=" text-xl font-semibold">
                  Project: {project.name}
                </p>
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
