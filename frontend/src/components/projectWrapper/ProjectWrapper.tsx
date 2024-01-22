import React, { ReactNode } from "react";
import AllUsersTable from "../AllUsersTable/AllUsersTable";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";
import UserSelectMenu from "../Menu/UserSelectMenu";
import { Heading } from "@chakra-ui/react";

interface ProjectWrapperProps {
  addUser: (email: string) => void;
  deleteUser: (email: string) => void;
  children: ReactNode;
}

const ProjectWrapper: React.FC<ProjectWrapperProps> = ({
  addUser,
  deleteUser,
  children,
}) => {
  const { activeProject } = useProjectsStore();
  const { userEmails, users } = useUsersStore();
  const avaliableUsers = users.filter((user) =>
    user.projects.filter((project) => project === activeProject?._id)
  );
  const usersOnProject = activeProject?.users.map((user) => user.email);

  const addUserHandler = (email: string) => {
    console.log("email", email);
    if (email !== "null") {
      addUser(email);
    }
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
              usersList={usersOnProject || []}
            />
          </div>
        </div>
        <div className=" flex flex-col  justify-center gap-1">
          <h2>Add users to the project</h2>
          <UserSelectMenu onSelect={addUserHandler} users={avaliableUsers} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProjectWrapper;
