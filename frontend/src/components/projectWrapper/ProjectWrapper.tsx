import React, { ReactNode } from "react";
import AllUsersTable from "../allUsersTable/AllUsersTable";
import classes from "./ProjectWrapper.module.css";
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
  const { users } = useUsersStore();

  const addUserHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const emailToAdd = event.target.value;
    if (emailToAdd !== "null") {
      addUser(emailToAdd);
    }
  };

  return (
    <div className="w-full">
      <div className=" flex flex-col gap-2 mt-12 ml-12 ">
        <div className=" text-3xl font-bold">
          {activeProject?.name || "No Name"}
        </div>
        <div className=" flex justify-between">
          <div className=" flex flex-col gap-1">
            <h3>People working on this project:</h3>
            <AllUsersTable deleteUser={deleteUser} usersList={usersList} />
          </div>
          <div>
            <h3>Add users to the project</h3>
            <select className={classes.select} onChange={addUserHandler}>
              <option value="null">Choose A User</option>
              {users.map((user, index) => (
                <option key={index} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className=" flex items-center justify-start ">
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default ProjectWrapper;
