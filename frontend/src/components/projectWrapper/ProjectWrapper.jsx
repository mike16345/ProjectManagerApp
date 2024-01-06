import { Fragment } from "react";
import AllUsersTable from "../allUsersTable/AllUsersTable";
import classes from "./ProjectWrapper.module.css";

import { useContext } from "react";
import AppContext from "../../context/Context";

// gets props from app and project overview
const ProjectWrapper = (props) => {
  const context = useContext(AppContext);
  const currentProject = context.currentProject;
  const addUserHandler = (event) => {
    const emailToAdd = event.target.value;
    if (emailToAdd !== "null") {
      props.addUser(emailToAdd);
    }
  };
  const deleteUser = (email) => {
    props.deleteUser(email);
  };
  return (
    <Fragment>
      <div className={classes["project-desc"]}>
        <h2>{props.currentProject.name}</h2>
        <h3>People working on this project:</h3>
        <div className={classes.users}>
          <AllUsersTable
            deleteUser={deleteUser}
            usersList={props.usersList}
          ></AllUsersTable>
          {context.userLogged.isAdmin && (
            <div>
              <h3>Add users to the project</h3>
              <select className={classes.select} onChange={addUserHandler}>
                <option value="null">choose a user</option>
                {props.allUsers.map((user, index) => (
                  <option key={index} value={user.email}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <div className={classes.wrap}>
        <div className={classes.projectWrapper}>{props.children}</div>
      </div>
    </Fragment>
  );
};

export default ProjectWrapper;
