import { columns as ProjectsColumns } from "@/components/Tables/ProjectsTable/ProjectColumns";
import { columns as UserColumns } from "@/components/Tables/UsersTable/UsersColumn";

import { DataTable } from "@/components/Tables/DataTable";
import { useUsersStore } from "@/store/usersStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectsStore } from "@/store/projectsStore";

const AdminPage = () => {
  const { users } = useUsersStore();
  const { projects } = useProjectsStore();

  return (
    <div className=" m-12">
      <Tabs defaultValue="Users" className="w-full">
        <TabsList>
          <TabsTrigger value="Users">Users</TabsTrigger>
          <TabsTrigger value="Projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="Users">
          <DataTable columns={UserColumns} data={users} />
        </TabsContent>
        <TabsContent value="Projects">
          <DataTable columns={ProjectsColumns} data={projects} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
