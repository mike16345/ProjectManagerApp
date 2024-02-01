import { columns as ProjectsColumns } from "@/components/Tables/ProjectsTable/ProjectColumns";
import { columns as UserColumns } from "@/components/Tables/UsersTable/UsersColumn";

import { DataTable } from "@/components/Tables/DataTable";
import { useUsersStore } from "@/store/usersStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectsStore } from "@/store/projectsStore";
import { IProject, IUser } from "@/interfaces";
import { projectRequests, BY_USER_ENDPOINT } from "@/requests/ProjectRequests";
import { taskRequests } from "@/requests/TaskRequests";
import { userRequests } from "@/requests/UserRequests";
import { refreshData } from "@/requests/dataRefresher";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ViewDataDialog from "@/components/Tables/ViewDataDialog";
import { useState } from "react";

const AdminPage = () => {
  const navigate = useNavigate();
  const { users } = useUsersStore();
  const { projects, setActiveProject, deleteProject } = useProjectsStore();
  const { toast } = useToast();
  const [dialogData, setDialogData] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isProjects, setIsProjects] = useState(false);
  const [currItemId, setCurrentItemId] = useState("");

  const handleAlert = (
    title: string,
    description: string,
    severity: "success" | "destructive" | "default" = "default"
  ) => {
    toast({
      title: title,
      description: description,
      variant: severity,
      duration: 2000,
    });
  };

  const handleDeleteProject = async (project: IProject) => {
    deleteProject(project);
    handleAlert(
      "Project Deleted",
      `${project.name} has been deleted`,
      "success"
    );
  };

  const handleViewProject = (project: IProject) => {
    setActiveProject(project);
    navigate("/project_overview/");
  };

  const handleMakeUserAdmin = async (user: IUser) => {
    user.isAdmin = true;
    await userRequests.editItemRequest(user);
    handleAlert("User Updated", `${user.name} has been made admin.`, "success");

    refreshData();
  };

  const handleViewProjectUsers = (users: IUser[], project_id: string): void => {
    setDialogData(users);
    setCurrentItemId(project_id);
    setIsProjects(true);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (user: IUser) => {
    const userProjects = await projectRequests.getItemsByRequest(
      user._id,
      BY_USER_ENDPOINT
    );

    for (const project of userProjects) {
      project.users = project.users.filter((u) => u._id !== user._id);
    }

    user.projects.forEach(async (project) => {
      await taskRequests.removeAssignedUserFromTasks(user._id, project);
    });

    await projectRequests.bulkEditItemsRequest(userProjects);
    await userRequests.deleteItemRequest(user._id);
    await refreshData();
    handleAlert(
      "User Deleted",
      `User ${user.name} has been deleted`,
      "success"
    );
  };

  const handleDeleteUserFromProject = async (
    user: IUser,
    project_id: string
  ) => {
    const updatedUserProjects = user.projects.filter((project: string) => {
      return project !== project_id;
    });
    user.projects = [...updatedUserProjects];
    const updatedProject = await projectRequests
      .getItemRequest(project_id)
      .then((project) => {
        project.users = project.users.filter((u) => u._id !== user._id);
        return project;
      });

    await projectRequests.editItemRequest(updatedProject);
    await userRequests.editItemRequest(user);

    isProjects
      ? setDialogData(updatedProject.users)
      : setDialogData(user.projects);
    refreshData();
  };

  const handleViewUser = (user: IUser) => {};

  const handleViewUserProjects = async (user: IUser, id: string) => {
    const userProjs = await projectRequests.getItemsByRequest(
      id,
      BY_USER_ENDPOINT
    );
    setCurrentItemId(user._id);
    setDialogData(userProjs);
    setOpenDialog(true);
    setIsProjects(false);
  };

  const handleDeleteProjFromUser = async (project: IProject, proj: string) => {
    const user = await userRequests.getItemRequest(currItemId);
    handleDeleteUserFromProject(user, proj);
  };

  return (
    <div className=" m-12">
      {openDialog && (
        <ViewDataDialog
          open={openDialog}
          currItemId={isProjects ? currItemId : undefined}
          data={dialogData}
          setOpen={setOpenDialog}
          handleDeleteItem={
            isProjects ? handleDeleteUserFromProject : handleDeleteProjFromUser
          }
        />
      )}
      <Tabs defaultValue="Users" className="w-full">
        <TabsList>
          <TabsTrigger value="Users">Users</TabsTrigger>
          <TabsTrigger value="Projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="Users">
          <DataTable
            handleDeleteData={handleDeleteUser}
            handleViewData={handleViewUser}
            handleSetData={handleMakeUserAdmin}
            handleViewNestedData={handleViewUserProjects}
            columns={UserColumns}
            data={users}
          />
        </TabsContent>
        <TabsContent value="Projects">
          <DataTable
            handleSetData={() => {}}
            handleDeleteData={handleDeleteProject}
            handleViewData={handleViewProject}
            handleViewNestedData={handleViewProjectUsers}
            columns={ProjectsColumns}
            data={projects}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AdminPage;
