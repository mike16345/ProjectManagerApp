import React, { useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { Profile } from "../Profile/Profile";
import { useUsersStore } from "../../store/usersStore";
import { IUser } from "../../interfaces";

interface AllUsersTableProps {
  usersList: IUser[];
  deleteUser: (user: IUser) => void;
}

const AllUsersTable: React.FC<AllUsersTableProps> = ({
  usersList,
  deleteUser,
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const { activeUser } = useUsersStore();

  const removeUserHandler = () => {
    setShowModal(false);
    if (!userToDelete) return;
    deleteUser(userToDelete);
  };

  const clickOnUserHandler = (user: IUser) => {
    if (!activeUser || !activeUser.isAdmin) return;
    setUserToDelete(user);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex gap-1 ">
        {showAll
          ? usersList.map((user, index: number) => (
              <div key={index}>
                <Profile onClick={() => clickOnUserHandler(user)} user={user} />
              </div>
            ))
          : usersList.slice(0, 5).map((user, index: number) => (
              <div key={index}>
                <Profile onClick={() => clickOnUserHandler(user)} user={user} />
              </div>
            ))}
        {usersList.length > 5 && (
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
          <h2>{`Would you like to remove "${userToDelete?.email}" from this project?`}</h2>
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
    </div>
  );
};

export default AllUsersTable;
