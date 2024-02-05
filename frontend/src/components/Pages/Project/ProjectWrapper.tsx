import React, { ReactNode } from "react";
import AllUsersTable from "../../AllUsersTable/AllUsersTable";
import { useProjectsStore } from "../../../store/projectsStore";
import UserSelectMenu from "../../Menu/UserSelectMenu";
import { IUser } from "../../../interfaces";
import { When } from "react-if";
import { useUsersStore } from "@/store/usersStore";

interface ProjectWrapperProps {
  addUser: (user: IUser) => void;
  deleteUser: (user: IUser) => void;
  availableUsers: Array<IUser>;
  children: ReactNode;
}

const ProjectWrapper: React.FC<ProjectWrapperProps> = ({
  addUser,
  deleteUser,
  availableUsers,
  children,
}) => {
  const { activeProject } = useProjectsStore();
  const { activeUser } = useUsersStore();

  const addUserHandler = (user: IUser) => {
    addUser(user);
  };
  const isProjectLead = () => {
    if (!activeProject || !activeProject.projectLead) return false;
    return (
      activeProject.projectLead.email.localeCompare(activeUser?.email || "") ===
      0
    );
  };

  return (
    <div className=" flex flex-col gap-4 p-8 max-h-[85vh] overflow-hidden ">
      <div className="flex justify-between items-start">
        <div className=" flex flex-col gap-4 w-1/2">
          <div className="flex flex-col  gap-1 ">
            <div className=" text-4xl font-bold text-primary ">
              {activeProject?.name || "No Name"}
            </div>
            <p className="ml-1 text-muted-foreground ">
              {activeProject?.description}
            </p>
          </div>
          <div className=" flex flex-col gap-1">
            <div className=" text-lg">Project Participants:</div>
            <AllUsersTable
              deleteUser={deleteUser}
              usersList={activeProject?.users || []}
            />
          </div>
        </div>
        <When condition={isProjectLead() || activeUser?.isAdmin}>
          <div className=" flex flex-col  justify-center gap-1">
            <h2>Add users to the project</h2>
            <UserSelectMenu onSelect={addUserHandler} users={availableUsers} />
          </div>
        </When>
      </div>
      {children}
    </div>
  );
};

export default ProjectWrapper;
