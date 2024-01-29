import React, { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import ProjectWrapper from "./ProjectWrapper";
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
import { IAllTasks, ITask, IUser } from "../../../interfaces";
import { useToast } from "@/components/ui/use-toast";
import { useUsersStore } from "../../../store/usersStore";
import { CreateTask } from "@/components/Task/CreateTask";

const allTasks: IAllTasks = {
  [TaskStatus.TODO]: [],
  [TaskStatus.IN_PROGRESS]: [],
  [TaskStatus.CODE_REVIEW]: [],
  [TaskStatus.DONE]: [],
};

interface ProjectOverviewProps {}
const ProjectOverview: React.FC<ProjectOverviewProps> = () => {
  const { activeProject, setActiveProject } = useProjectsStore();
  const { activeUser } = useUsersStore();
  const { users } = useUsersStore();

  const [taskArr, setTaskArr] = useState(allTasks);
  const [taskTypeToAdd, setTaskTypeToAdd] = useState(TaskStatus.TODO);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);
  const { toast } = useToast();

  const filterUsers = () => {
    return users.filter((user) =>
      user.projects.every((projectID) => projectID !== activeProject?._id)
    );
  };

  const [availableUsers, setAvailableUsers] = useState<IUser[]>(filterUsers());
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

  const onTaskClickHandler = (task: ITask) => {
    setTaskToEdit(task);
    setIsCreatingTask(true);
  };

  const onAddUsertoProjectHandler = async (user: IUser) => {
    if (!activeProject || (!activeUser?.isAdmin && !isProjectLead())) return;
    const updatedProject = {
      ...activeProject,
      users: [...activeProject.users, user],
    };
    setActiveProject(updatedProject);
    updateProjectById(updatedProject);
    user.projects = [...user.projects, updatedProject._id!];
    await editUser(user);

    toast({
      title: "User added to project",
      variant: "success",
      duration: 3000,
    });
  };

  const isProjectLead = () => {
    if (!activeProject) return false;
    return (
      activeProject.projectLead.email.localeCompare(activeUser?.email || "") ===
      0
    );
  };

  const onDeleteUserFromProjHandler = async (userToDelete: IUser) => {
    if (!activeProject || (!activeUser?.isAdmin && !isProjectLead())) return;

    const filtered = activeProject.users.filter(
      (user) => user.email !== userToDelete.email
    );

    activeProject.users = filtered;
    await updateProjectById(activeProject);
    await removeProjectFromUser(userToDelete.email);
    await removeUserFromTasks(userToDelete.email);
    setAvailableUsers(filterUsers());
      
    if (activeProject) getTasksFromAPI(activeProject._id!);
  };

  const removeUserFromTasks = async (userEmail: string) => {
    if (!activeProject || (!activeUser?.isAdmin && !isProjectLead())) return;

    try {
      await removeAssignedUserFromTasks(userEmail, activeProject._id!);

      toast({
        title: `Successfully unassigned ${userEmail} from task`,
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: `Failed to remove user from task`,
        variant: "destructive",
        description: "Try again later",
        duration: 3000,
      });
      console.error(error);
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
    } catch (error) {
      toast({
        title: "Failed to delete user from project",
        description: "Try again later",
        duration: 2000,
        variant: "destructive",
      });
    }
  };

  const onCreateIssue = async (task: ITask) => {
    task.status = taskTypeToAdd;
    try {
      const res = await postTask(task);

      toast({
        title: "Task Created",
        description: "Successfully created task",
        duration: 2000,
        variant: "success",
      });
      setTaskArr({
        ...taskArr,
        [taskTypeToAdd]: [...taskArr[taskTypeToAdd], res.data],
      });
    } catch (error) {
      toast({
        title: "Could not create task",
        description: "Failed to create task",
        duration: 2000,

        variant: "destructive",
      });
    }
    setIsCreatingTask(false);
  };

  const onEditTask = async (task: any) => {
    try {
      const res = await putEditTask(task);

      setTaskArr({
        ...taskArr,
        [taskTypeToAdd]: [...taskArr[taskTypeToAdd], res.data],
      });
      toast({
        title: "Task Updated!",
        description: "Successfully updated task",
        duration: 2000,

        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Could not update task",
        description: "Failed to update task",
        duration: 2000,

        variant: "destructive",
      });
    }

    setTaskToEdit(null);
    setIsCreatingTask(false);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const res = await deleteTask(id);

      toast({
        title: "Task Deleted",
        description: "Successfully deleted task",
        duration: 2000,
        variant: "success",
      });

      if (activeProject) getTasksFromAPI(activeProject._id!);
    } catch (error) {
      toast({
        title: "Could not delete task",
        description: "Failed to delete task",
        duration: 2000,

        variant: "destructive",
      });
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

  useEffect(() => {
    if (!activeProject) return;
    getTasksFromAPI(activeProject._id!);
  }, []);

  return (
    <div className="w-full p-4">
      <ProjectWrapper
        availableUsers={availableUsers}
        deleteUser={onDeleteUserFromProjHandler}
        addUser={onAddUsertoProjectHandler}
      >
        <TaskColumnWrapper
          handleAddNewTask={handleAddNewTask}
          onTaskClickHandler={onTaskClickHandler}
          tasks={taskArr}
        />
      </ProjectWrapper>
      <CreateTask
        availableUsers={activeProject?.users || []}
        isOpen={isCreatingTask}
        taskType={taskTypeToAdd}
        confirmButtonText={taskToEdit ? "Save Changes" : "Submit"}
        onCreateTask={taskToEdit ? onEditTask : onCreateIssue}
        setIsOpen={handleCancelAddTask}
        taskToEdit={taskToEdit}
        handleDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default ProjectOverview;
