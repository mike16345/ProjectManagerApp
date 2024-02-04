import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface INotification {
  title: string;
  message: string;
  type: string;
}

const Notification: React.FC<INotification> = ({ openModal, setOpenModal  }) => {
  return (
    <div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove user</DialogTitle>
            <DialogDescription>
              {`Would you like to remove "${userToDelete?.email}" from this project?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className=" flex-center gap-1">
            <Button
              variant={"destructive"}
              onClick={() => setShowModal(false)}
              type="submit"
            >
              Decline
            </Button>
            <Button onClick={() => console.log("add user")}>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notification;
