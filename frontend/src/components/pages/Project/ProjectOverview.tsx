import React, { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import ProjectWrapper from "../../ProjectWrapper/ProjectWrapper";
import TaskColumnWrapper from "../../Task/TaskColumnWrapper";
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
import CreateTask from "../../Task/CreateTask";
import { useToast } from "@chakra-ui/react";

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
  const toast = useToast();
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
    getTasksFromAPI(activeProject._id!);
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
    if (!foundUser || !activeProject) return;
    const res = await getOneUser(email);
    const user = res.data;
    activeProject.users = [...activeProject.users, user];
    updateProjectById(activeProject);
    user.projects = [...user.projects, activeProject._id];
    const userEdited = await editUser(user);
  };

  const onDeleteUserFromProjHandler = async (email: string) => {
    if (!activeProject) return;
    const filtered = activeProject.users.filter((user) => user.email !== email);
    activeProject.users = filtered;
    updateProjectById(activeProject);
    removeProjectFromUser(email);
    await removeUserFromTasks(email);
    if (activeProject) getTasksFromAPI(activeProject._id!);
  };

  const removeUserFromTasks = async (userEmail: string) => {
    if (!activeProject) return;
    try {
      await removeAssignedUserFromTasks(userEmail, activeProject._id!);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProjectFromUser = async (email: string) => {
    try {
      const user = (await getOneUser(email)).data;
      const currentProjectId = activeProject?._id;
      const updatedUserProjects = user.projects.filter((project: string) => {
        return project !== currentProjectId;
      });
      user.projects = [...updatedUserProjects];
      editUser(user);
      toast({
        title: "User removed from project",
        status: "success",
        position: "top-right",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Failed to delete user from project",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onCreateIssue = async (task: ITask) => {
    task.status = taskTypeToAdd;
    const res = await postTask(task);
    if (res.request === "ERR_BAD_REQUEST") {
      toast({
        title: "Could not create task",
        description: "Failed to create task",
        status: "error",
      });
    } else {
      toast({
        title: "Task Created",
        description: "Successfully created task",
        position: "top-right",
        status: "success",
      });
    }
    setIsCreatingTask(false);
  };

  const onEditTask = async (task: any) => {
    const res = await putEditTask(task);
    if (res.request === "ERR_BAD_REQUEST") {
      toast({
        title: "Could not update task",
        position: "top-right",
        description: "Failed to update task",
        status: "error",
      });
    } else {
      toast({
        title: "Task Updated!",
        description: "Successfully updated task",
        position: "top-right",
        status: "success",
      });
    }
    setTaskToEdit(null);
    setIsCreatingTask(false);
  };

  const handleDeleteTask = async (id: number) => {
    const res = await deleteTask(id);
    if (res.status == 200) {
      toast({
        title: "Task Deleted",
        description: "Successfully deleted task",
        position: "top-right",
        status: "success",
      });

      if (activeProject) getTasksFromAPI(activeProject._id!);
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
