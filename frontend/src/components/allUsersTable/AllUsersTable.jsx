import { Fragment, useState, useContext } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import Profile from "../profile/Profile";
import classes from "./AllUsersTable.module.css";
import AppContext from "../../context/Context";

let userToDelete = "";
// gets props from ProjectWrapper
const AllUsersTable = (props) => {
  const context = useContext(AppContext);

  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const removeUserHandler = () => {
    setShowModal(false);
    props.deleteUser(userToDelete);
  };

  const clickOnUserHandler = (email) => {
    if (!context.userLogged.isAdmin) return;
    userToDelete = email;
    setShowModal(true);
  };

  return (
    <Fragment>
      <div className={classes.wrapper}>
        {showAll
          ? props.usersList.map((name, index) => (
              <p key={index}>
                {
                  <Profile
                    onClick={clickOnUserHandler}
                    index={index}
                    name={name}
                    isList={true}
                  />
                }
              </p>
            ))
          : props.usersList
              .slice(0, 5)
              .map((name, index) => (
                <p key={index}>
                  {
                    <Profile
                      onClick={clickOnUserHandler}
                      index={index}
                      name={name}
                      isList={true}
                    />
                  }
                </p>
              ))}
        {props.usersList.length > 5 && (
          <span
            onClick={() => setShowAll(!showAll)}
            className={classes["show-more"]}
          >
            {!showAll ? "Show more" : "Show less"}
          </span>
        )}
      </div>
      {showModal && (
        <Modal>
          <h2>{`Would you like to remove "${userToDelete}" from this project?`}</h2>
          <div className={classes.btns}>
            <Button onClick={removeUserHandler} type="submit">
              Yes
            </Button>
            <Button onClick={() => setShowModal(false)} type="submit">
              No
            </Button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default AllUsersTable;
