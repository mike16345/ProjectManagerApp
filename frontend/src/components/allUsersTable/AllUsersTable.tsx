import React, { Fragment, useState, useContext } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import Profile from "../profile/Profile";
import AppContext from "../../context/Context";
import { useUsersStore } from "../../store/usersStore";

interface Props {
  usersList: string[];
  deleteUser: (email: string) => void;
}

const AllUsersTable: React.FC<Props> = (props: Props) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string>("");
  const { activeUser } = useUsersStore();
  const removeUserHandler = () => {
    setShowModal(false);
    props.deleteUser(userToDelete);
  };

  const clickOnUserHandler = (email: string) => {
    if (!activeUser || !activeUser.isAdmin) return;
    setUserToDelete(email);
    setShowModal(true);
  };

  return (
    <Fragment>
      <div className="flex max-w-max justify-between">
        {showAll
          ? props.usersList.map((name: string, index: number) => (
              <div key={index}>
                <Profile onClick={() => clickOnUserHandler(name)} name={name} />
              </div>
            ))
          : props.usersList.slice(0, 5).map((name: string, index: number) => (
              <p key={index}>
                <Profile onClick={() => clickOnUserHandler(name)} name={name} />
              </p>
            ))}
        {props.usersList.length > 5 && (
          <span
            onClick={() => setShowAll(!showAll)}
            className="cursor-pointer ml-2 underline flex items-center"
          >
            {!showAll ? "Show more" : "Show less"}
          </span>
        )}
      </div>
      {showModal && (
        <Modal onClose={() => {}}>
          <h2>{`Would you like to remove "${userToDelete}" from this project?`}</h2>
          <div className="flex justify-around">
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
