import React, { useState } from "react";
import { Profile } from "../Profile/Profile";
import { useUsersStore } from "../../store/usersStore";
import { IUser } from "../../interfaces";
import { useProjectsStore } from "@/store/projectsStore";
import { CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const { activeUser } = useUsersStore();
  const { activeProject } = useProjectsStore();

  const removeUserHandler = () => {
    setShowModal(false);
    if (!userToDelete) return;
    deleteUser(userToDelete);
  };

  const isProjectLead = () => {
    if (!activeProject) return false;
    return (
      activeProject.projectLead.email.localeCompare(activeUser?.email || "") ===
      0
    );
  };

  const clickOnUserHandler = (user: IUser) => {
    if (!activeUser || (!activeUser.isAdmin && !isProjectLead())) return;
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleHoverOnUser = (user: IUser) => {
    console.log("hovering on user", user);
    setSelectedUser(user);
    setTimeout(() => {
      setShowUserDetails(true), 5000;
    });
  };
  return (
    <div>
      <div className="flex gap-1 ">
        {showAll
          ? usersList.map((user, index: number) => (
              <div
                onMouseLeave={() => {
                  setShowUserDetails(false);
                  setSelectedUser(null);
                }}
                onMouseOver={() => handleHoverOnUser(user)}
                key={index}
              >
                <Profile onClick={() => clickOnUserHandler(user)} user={user} />
              </div>
            ))
          : usersList.slice(0, 5).map((user, index: number) => (
              <div key={index}>
                <div
                  onMouseLeave={() => {
                    setShowUserDetails(false);
                    setSelectedUser(null);
                  }}
                  onMouseOver={() => handleHoverOnUser(user)}
                  key={index}
                >
                  <Profile
                    onClick={() => clickOnUserHandler(user)}
                    user={user}
                  />
                </div>
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
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove user</DialogTitle>
            <DialogDescription>
              {`Would you like to remove "${userToDelete?.email}" from this project?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"secondary"} onClick={() => setShowModal(false)} type="submit">
              No
            </Button>
            <Button onClick={removeUserHandler} type="submit">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <HoverCard
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
        defaultOpen={showUserDetails}
      >
        <HoverCardTrigger></HoverCardTrigger>
        <HoverCardContent className="w-[300px]">
          <div className="flex justify-between space-x-4">
            <Profile user={selectedUser!} />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@{selectedUser?.name}</h4>
              <p className="text-sm">{selectedUser?.email}</p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  Joined{" "}
                  {new Date(selectedUser?.date_created!).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default AllUsersTable;
