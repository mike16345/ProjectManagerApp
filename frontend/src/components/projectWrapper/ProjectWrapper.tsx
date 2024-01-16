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
    <div>
      <div className={classes["project-desc"]}>
        <h2>{activeProject?.name || "No Name"}</h2>
        <h3>People working on this project:</h3>
        <div className={classes.users}>
          <AllUsersTable deleteUser={deleteUser} usersList={usersList} />
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
      <div className={classes.wrap}>
        <div className={classes.projectWrapper}>{children}</div>
      </div>
    </div>
  );
};

export default ProjectWrapper;
