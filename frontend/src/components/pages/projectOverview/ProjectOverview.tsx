import React, { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import ProjectWrapper from "../../projectWrapper/ProjectWrapper";
import InputModal from "../../InputModal/InputModal";
import TaskColumnWrapper from "./TaskColumnWrapper";
import {
  postTask,
  putEditTask,
  deleteTask,
  getAllProjectTasks,
} from "../../../API/TaskAPIcalls";
import {
  getOneUser,
  editUser,
  editUserByEmail,
} from "../../../API/UserAPIcalls";
import {
  updateProjectById,
  removeAssignedUserFromTasks,
} from "../../../API/ProjectAPIcalls";
import { useProjectsStore } from "../../../store/projectsStore";
import { TaskStatus } from "../../../enums/TaskStatus";
import { IAllTasks, ITask } from "../../../interfaces";
import { When } from "react-if";
import CreateTask from "../../task/CreateTask";

interface ProjectOverviewProps {}

const ProjectOverview: React.FC<ProjectOverviewProps> = () => {
  const { activeProject } = useProjectsStore();
  const projectUsersEmails = activeProject?.users.map((user) => user.email);
  const allTasks: IAllTasks = {
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.CODE_REVIEW]: [],
    [TaskStatus.DONE]: [],
  };

  const [taskArr, setTaskArr] = useState(allTasks);
  const [taskTypeToAdd, setTaskTypeToAdd] = useState(TaskStatus.TODO);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  const filterToColumns = (tasks: any[]) => {
    const cloned = cloneDeep(taskArr);
    const filterTodo = tasks.filter((task) => task.status === TaskStatus.TODO);

    const filterInProgress = tasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    );
    const filterCodeReview = tasks.filter(
      (task) => task.status === TaskStatus.CODE_REVIEW
    );
    const filterDone = tasks.filter((task) => task.status === TaskStatus.DONE);

    cloned[TaskStatus.TODO] = filterTodo;
    cloned[TaskStatus.IN_PROGRESS] = filterInProgress;
    cloned[TaskStatus.CODE_REVIEW] = filterCodeReview;
    cloned[TaskStatus.DONE] = filterDone;
    setTaskArr(cloned);
  };

  const getTasksFromAPI = async (id: string) => {
    const tasks = await getAllProjectTasks(id);
    filterToColumns(tasks);
  };

  useEffect(() => {
    if (!activeProject) return;
    getTasksFromAPI(activeProject._id);
  }, [isCreatingTask]);

  const onTaskClickHandler = (task: ITask) => {
    setTaskToEdit(task);
    setIsCreatingTask(true);
  };

  const findUser = (email: string) => {
    if (!activeProject) return false;

    activeProject.users.forEach((user) => {
      if (user.email.localeCompare(email) === 0) {
        return true;
      }
    });

    return false;
  };

  const onAddUsertoProjectHandler = async (email: string) => {
    const foundUser = findUser(email);
    if (foundUser || !activeProject) return;
    if (!findUser(email)) {
      const res = await getOneUser(email);
      const user = res.data;
      activeProject.users = [...activeProject.users, user];
      updateProjectById(activeProject);
      user.projects = [...user.projects, activeProject._id];
      const userEdited = await editUser(user);
    }
  };

  const onDeleteUserFromProjHandler = async (email: string) => {
    if (!activeProject) return;
    const filtered = activeProject.users.filter((user) => user.email !== email);
    activeProject.users = filtered;
    updateProjectById(activeProject);
    removeProjectFromUser(email);
    await removeUserFromTasks(email);
    getTasksFromAPI(activeProject._id);
  };

  const removeUserFromTasks = async (userEmail: string) => {
    if (!activeProject) return;
    try {
      await removeAssignedUserFromTasks(userEmail, activeProject._id);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProjectFromUser = async (email: string) => {
    let user: any = null;
    try {
      user = (await getOneUser(email)).data;
      const currentProjectId = activeProject?._id;
      const updatedUserProjects = user.projects.filter((project: string) => {
        return project !== currentProjectId;
      });
      user.projects = [...updatedUserProjects];
    } catch (error) {
      console.log(error);
    }

    try {
      editUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  const onCreateIssue = async (task: ITask) => {
    task.status = taskTypeToAdd;
    const res = await postTask(task);
    console.log("res", res);
    if (res.request === "ERR_BAD_REQUEST") {
      console.log(res.data[0].message);
    }
    setIsCreatingTask(false);
  };

  const onEditTask = async (task: any) => {
    const res = await putEditTask(task);
    if (res.request === "ERR_BAD_REQUEST") {
      console.log(res.data[0].message);
    }
    setTaskToEdit(null);
  };

  const handleDeleteTask = async (id: number) => {
    const res = await deleteTask(id);
    if (res.status == 200) {
      //Add Successfully deleted the task alert
      console.log("successfully deleted task");
    }
    setIsCreatingTask(false);
    setTaskToEdit(null);
  };

  const handleAddNewTask = (taskTypeToAdd: TaskStatus) => {
    setTaskTypeToAdd(taskTypeToAdd);
    setIsCreatingTask(true);
  };

  const handleCancelAddTask = () => {
    setIsCreatingTask(false);
    setTaskToEdit(null);
  };
  return (
    <div className="w-full p-4">
      <ProjectWrapper
        deleteUser={onDeleteUserFromProjHandler}
        usersList={projectUsersEmails || []}
        addUser={onAddUsertoProjectHandler}
      >
        <TaskColumnWrapper
          handleAddNewTask={handleAddNewTask}
          onTaskClickHandler={onTaskClickHandler}
          tasks={taskArr}
        />
      </ProjectWrapper>
      <When condition={isCreatingTask}>
        <CreateTask
          usersList={projectUsersEmails || []}
          confirmButtonText={taskToEdit ? "Save Changes" : "Submit"}
          onCreateTask={taskToEdit ? onEditTask : onCreateIssue}
          onCloseModal={handleCancelAddTask}
          taskToEdit={taskToEdit}
          handleDeleteTask={handleDeleteTask}
        />
      </When>
    </div>
  );
};

export default ProjectOverview;
