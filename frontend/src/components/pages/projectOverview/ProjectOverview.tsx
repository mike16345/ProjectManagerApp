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
import { Task } from "../../../interfaces";
import { useUsersStore } from "../../../store/usersStore";
import { When } from "react-if";

let taskToChange: any = {};

interface ProjectOverviewProps {}
interface AllTasks {
  todo: Task[];
  inProgress: Task[];
  codeReview: Task[];
  done: Task[];
}
const ProjectOverview: React.FC<ProjectOverviewProps> = () => {
  const { activeProject } = useProjectsStore();
  const projectUsersEmails = activeProject?.users.map((user) => user.email);
  const { userEmails } = useUsersStore();
  const allTasks: AllTasks = {
    todo: [],
    inProgress: [],
    codeReview: [],
    done: [],
  };

  const [taskArr, setTaskArr] = useState(allTasks);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
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
    if (!activeProject) return;
    getTasksFromAPI(activeProject._id);
  }, [editTaskOpen, createIssueOpen]);

  const onTaskClickHandler = (id: string, status: string) => {
    const valuesTasks = Object.values(taskArr);

    valuesTasks.map((taskArrays) =>
      taskArrays.map((task: Task) => {
        if (task.task_id === id) {
          setTaskToEdit(task);
        }
      })
    );
    setEditTaskOpen(true);
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

  const onCreateIssue = async (task: Task) => {
    console.log("task", task);
    const res = await postTask(task);
    console.log("res", res);
    if (res.request === "ERR_BAD_REQUEST") {
      console.log(res.data[0].message);
    }
    setCreateIssueOpen(false);
    console.log(taskArr);
  };

  const onEditTask = async (task: any) => {
    const res = await putEditTask(task);
    if (res.request === "ERR_BAD_REQUEST") {
      console.log(res.data[0].message);
    }
    setEditTaskOpen(false);
  };

  const onDeleteTask = async (id: string) => {
    const res = await deleteTask(id);
  };

  return (
    <div>
      <When condition={createIssueOpen}>
        <InputModal
          usersList={projectUsersEmails || []}
          confirmButtonText={editTaskOpen ? "Save Changes" : "Submit"}
          onCreateTask={editTaskOpen ? onEditTask : onCreateIssue}
          onCloseModal={() => setCreateIssueOpen(false)}
          isEditMode={editTaskOpen}
        />
      </When>
      {/* <InputModal
        usersList={projectUsersEmails || []}
        taskToEdit={taskToEdit}
        confirmButtonText="Save changes"
        onCreateTask={onEditTask}
        onCloseModal={() => setEditTaskOpen(false)}
        deleteTask={onDeleteTask}
        isEditMode={true}
      /> */}
      <ProjectWrapper
        deleteUser={onDeleteUserFromProjHandler}
        usersList={projectUsersEmails || []}
        addUser={onAddUsertoProjectHandler}
      >
        <TaskColumnWrapper
          onUpdate={onTaskClickHandler}
          openCreateIssueModal={() => setCreateIssueOpen(true)}
          tasks={taskArr}
        />
      </ProjectWrapper>
    </div>
  );
};

export default ProjectOverview;
