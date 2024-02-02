import React, { ReactNode } from "react";
import AllUsersTable from "../../AllUsersTable/AllUsersTable";
import { useProjectsStore } from "../../../store/projectsStore";
import UserSelectMenu from "../../Menu/UserSelectMenu";
import { IUser } from "../../../interfaces";

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

  const addUserHandler = (user: IUser) => {
    addUser(user);
  };

  return (
    <div className=" flex flex-col gap-4 p-8 max-h-[85vh] overflow-hidden ">
      <div className="flex justify-between  items-center">
        <div className=" flex flex-col gap-2">
          <div className=" text-4xl font-bold text-primary ">
            {activeProject?.name || "No Name"}
          </div>
          <div className=" flex flex-col gap-1">
            <div className=" text-lg">Project Participants:</div>
            <AllUsersTable
              deleteUser={deleteUser}
              usersList={activeProject?.users || []}
            />
          </div>
        </div>
        <div className=" flex flex-col  justify-center gap-1">
          <h2>Add users to the project</h2>
          <UserSelectMenu onSelect={addUserHandler} users={availableUsers} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProjectWrapper;
