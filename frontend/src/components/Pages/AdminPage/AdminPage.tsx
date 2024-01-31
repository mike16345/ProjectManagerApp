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

const AdminPage = () => {
  const navigate = useNavigate();
  const { users } = useUsersStore();
  const { projects, setActiveProject, deleteProject } = useProjectsStore();
  const { toast } = useToast();

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

  const handleViewProjectUsers = (users: IUser[]): void => {};

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

  const handleViewUser = (user: IUser) => {};

  const handleViewUserProjects = (userProjects: IProject[]) => {};

  return (
    <div className=" m-12">
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
