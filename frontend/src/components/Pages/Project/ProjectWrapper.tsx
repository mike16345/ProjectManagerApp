import React, { ReactNode } from "react";
import AllUsersTable from "../../AllUsersTable/AllUsersTable";
import { useProjectsStore } from "../../../store/projectsStore";
import { useUsersStore } from "../../../store/usersStore";
import UserSelectMenu from "../../Menu/UserSelectMenu";
import { Heading } from "@chakra-ui/react";
import { IUser } from "../../../interfaces";

interface ProjectWrapperProps {
  addUser: (user: IUser) => void;
  deleteUser: (user: IUser) => void;
  children: ReactNode;
}

const ProjectWrapper: React.FC<ProjectWrapperProps> = ({
  addUser,
  deleteUser,
  children,
}) => {
  const { activeProject } = useProjectsStore();
  const { users } = useUsersStore();
  console.log("users", users);
  const availableUsers = users.filter((user) =>
    user.projects.every((projectID) => projectID !== activeProject?._id)
  );

  const addUserHandler = (user: IUser) => {
    addUser(user);
  };

  return (
    <div className=" flex flex-col gap-4 ">
      <div className="flex justify-between p-2 items-center">
        <div className=" flex flex-col gap-2">
          <Heading>{activeProject?.name || "No Name"}</Heading>
          <div className=" flex flex-col gap-1">
            <h3>People working on this project:</h3>
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
