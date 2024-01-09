import React, { Fragment, ReactNode } from "react";
import AllUsersTable from "../allUsersTable/AllUsersTable";
import classes from "./ProjectWrapper.module.css";

interface ProjectWrapperProps {
  addUser: (email: string) => void;
  deleteUser: (email: string) => void;
  currentProject: { name: string };
  usersList: string[];
  allUsers: { email: string }[];
  children: ReactNode;
}

const ProjectWrapper: React.FC<ProjectWrapperProps> = ({
  addUser,
  deleteUser,
  currentProject,
  usersList,
  allUsers,
  children,
}) => {
  const addUserHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const emailToAdd = event.target.value;
    if (emailToAdd !== "null") {
      addUser(emailToAdd);
    }
  };

  return (
    <Fragment>
      <div className={classes["project-desc"]}>
        <h2>{currentProject.name}</h2>
        <h3>People working on this project:</h3>
        <div className={classes.users}>
          <AllUsersTable deleteUser={deleteUser} usersList={usersList} />
          <div>
            <h3>Add users to the project</h3>
            <select className={classes.select} onChange={addUserHandler}>
              <option value="null">choose a user</option>
              {allUsers.map((user, index) => (
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
    </Fragment>
  );
};

export default ProjectWrapper;
