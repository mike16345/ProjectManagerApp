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
    setSelectedUser(user);
    setTimeout(() => {
      setShowUserDetails(true), 5000;
    });
  };
  return (
    <div>
      <div className="flex gap-1 ">
        {usersList.map((user, index: number) => (
          <div
            key={index}
            onMouseLeave={() => {
              setShowUserDetails(false);
              setSelectedUser(null);
            }}
            style={{ display: showAll || index < 5 ? "block" : "none" }}
          >
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <div>
                  <Profile
                    onClick={() => clickOnUserHandler(user)}
                    user={user}
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-[300px]">
                <div className="flex space-x-4">
                  <Profile user={user} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@{user?.name}</h4>
                    <p className="text-sm">{user?.email}</p>
                    <div className="flex items-center pt-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                      <span className="text-xs text-muted-foreground">
                        Joined{" "}
                        {new Date(user?.date_created!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
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
            <Button
              variant={"secondary"}
              onClick={() => setShowModal(false)}
              type="submit"
            >
              No
            </Button>
            <Button onClick={removeUserHandler} type="submit">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllUsersTable;
