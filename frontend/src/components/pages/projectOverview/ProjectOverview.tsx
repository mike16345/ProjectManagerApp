import React, { useState, useEffect, useContext, Fragment } from "react";
import AppContext from "../../../context/context";
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

let taskToChange: any = {};

interface ProjectOverviewProps {}

const ProjectOverview: React.FC<ProjectOverviewProps> = () => {
  const context = useContext(AppContext);
  const currentProject = context.currentProject;
  const emails = currentProject.users.map((user) => user.email);

  const allData = {
    todo: [],
    inProgress: [],
    codeReview: [],
    done: [],
  };

  const [users, setUsers] = useState(context.currentProject.users);
  const [taskArr, setTaskArr] = useState(allData);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const [editTask, setEditTask] = useState(false);

  const filterToColumns = (tasks: any[]) => {
    const cloned = cloneDeep(taskArr);
    const filterTodo = tasks.filter((task) => task.status === "to do");
    const filterInProgress = tasks.filter(
      (task) => task.status === "in progress"
    );
    const filterCodeReview = tasks.filter(
      (task) => task.status === "code review"
    );
    const filterDone = tasks.filter((task) => task.status === "done");
    cloned.todo = filterTodo;
    cloned.inProgress = filterInProgress;
    cloned.codeReview = filterCodeReview;
    cloned.done = filterDone;
    setTaskArr(cloned);
  };

  const getTasksFromAPI = async (id: string) => {
    const tasks = await getAllProjectTasks(id);
    filterToColumns(tasks);
  };

  useEffect(() => {
    getTasksFromAPI(currentProject._id);
  }, [editTask, createIssueOpen]);

  const onTaskClickHandler = (id: string, status: string) => {
    const valuesTasks = Object.values(taskArr);
    valuesTasks.map((taskArrays) =>
      taskArrays.map((task) => {
        if (task.task_id === id) {
          taskToChange = task;
        }
      })
    );
    setEditTask(true);
  };

  const findUser = (email: string) => {
    let found = false;
    currentProject.users.forEach((user) => {
      if (user.email.localeCompare(email) === 0) {
        found = true;
      }
    });
    return found;
  };

  const onAddUsertoProjectHandler = async (email: string) => {
    if (!findUser(email)) {
      const res = await getOneUser(email);
      const user = res.data;
      context.currentProject.users = [...context.currentProject.users, user];
      setUsers(context.currentProject.users);
      updateProjectById(context.currentProject);
      user.projects = [...user.projects, currentProject._id];
      const userEdited = await editUser(user);
    }
  };

  const onDeleteUserFromProjHandler = async (email: string) => {
    const filtered = currentProject.users.filter(
      (user) => user.email !== email
    );
    currentProject.users = filtered;
    updateProjectById(currentProject);
    removeProjectFromUser(email);
    await removeUserFromTasks(email);
    getTasksFromAPI(currentProject._id);
    setUsers(filtered);
  };

  const removeUserFromTasks = async (userEmail: string) => {
    try {
      await removeAssignedUserFromTasks(userEmail, currentProject._id);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProjectFromUser = async (email: string) => {
    let user: any = null;
    try {
      user = (await getOneUser(email)).data;
      const currentProjectId = currentProject._id;
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

  const onCreateIssue = async (task: any) => {
    const res = await postTask(task);
    if (res.code === "ERR_BAD_REQUEST") {
      console.log(res.response.data[0].message);
    }
    setCreateIssueOpen(false);
    console.log(taskArr);
  };

  const onEditTask = async (task: any) => {
    const res = await putEditTask(task);
    if (res.code === "ERR_BAD_REQUEST") {
      console.log(res.response.data[0].message);
    }
    setEditTask(false);
  };

  const onDeleteTask = async (id: string) => {
    const res = await deleteTask(id);
  };

  const onCloseModalHandler = () => {
    setCreateIssueOpen(false);
  };

  const openModalHandler = () => {
    setCreateIssueOpen(true);
  };

  return (
    <Fragment>
      {createIssueOpen && (
        <InputModal
          usersList={emails}
          okBtn="Submit"
          task_id={Date.now().valueOf()}
          onCreateIssue={onCreateIssue}
          onCloseModal={onCloseModalHandler}
          isEditMode={false}
        />
      )}
      {editTask && (
        <InputModal
          usersList={emails}
          task={taskToChange}
          descValue={taskToChange.text}
          userSelected={taskToChange.email}
          prioritySelected={taskToChange.priority}
          okBtn="Save changes"
          task_id={taskToChange.task_id}
          status={taskToChange.status}
          onCreateIssue={onEditTask}
          onCloseModal={() => setEditTask(false)}
          delete={onDeleteTask}
          isEditMode={true}
        />
      )}
      <ProjectWrapper
        deleteUser={onDeleteUserFromProjHandler}
        allUsers={context.userEmails}
        usersList={emails}
        currentProject={currentProject}
        addUser={onAddUsertoProjectHandler}
      >
        <TaskColumnWrapper
          onUpdate={onTaskClickHandler}
          openCreateIssueModal={openModalHandler}
          tasks={taskArr}
        />
      </ProjectWrapper>
    </Fragment>
  );
};

export default ProjectOverview;