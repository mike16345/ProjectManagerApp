import React, { ReactNode } from "react";
import AllUsersTable from "../allUsersTable/AllUsersTable";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";

interface ProjectWrapperProps {
  addUser: (email: string) => void;
  deleteUser: (email: string) => void;
  usersList: string[];
  children: ReactNode;
}

const ProjectWrapper: React.FC<ProjectWrapperProps> = ({
  addUser,
  deleteUser,
  usersList,
  children,
}) => {
  const { activeProject } = useProjectsStore();
  const { userEmails } = useUsersStore();

  const addUserHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const emailToAdd = event.target.value;
    if (emailToAdd !== "null") {
      addUser(emailToAdd);
    }
  };

  return (
    <div className=" flex flex-col gap-4 ">
      <div className="flex justify-between p-2 items-center">
        <div className=" flex flex-col gap-2">
          <div className=" font-bold text-2xl">
            {activeProject?.name || "No Name"}
          </div>
          <div className=" flex flex-col gap-1">
            <h3>People working on this project:</h3>
            <AllUsersTable deleteUser={deleteUser} usersList={usersList} />
          </div>
        </div>
        <div className=" flex flex-col  justify-center gap-1">
          <h2>Add users to the project</h2>
          <select
            className=" border bg-indigo-500  text-white p-1 rounded"
            onChange={addUserHandler}
          >
            <option value="null">Choose A User</option>
            {Object.values(userEmails).map((email, index) => (
              <option key={email._id} value={email.email}>
                {email.email}
              </option>
            ))}
          </select>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProjectWrapper;
