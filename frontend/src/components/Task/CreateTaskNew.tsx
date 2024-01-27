import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CreateTaskForm } from "../Forms/CreateTaskForm";
import { ITask } from "@/interfaces";

interface CreateTaskNewProps {
  isOpen: boolean;
  setIsOpen: () => void;
  taskToEdit?: ITask | null;
  usersList: string[];
  confirmButtonText: string;
  onCreateTask: (task: ITask) => void;
  handleDeleteTask: (taskId: number) => void;
}

export const CreateTaskNew: React.FC<CreateTaskNewProps> = ({
  isOpen,
  setIsOpen,
  onCreateTask,
  taskToEdit,
  usersList,
  confirmButtonText,
  handleDeleteTask,
}) => {
  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetContent spellCheck>
        <SheetHeader>
          <SheetTitle>Create Task</SheetTitle>
          <SheetDescription>
            Make changes to your task here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <CreateTaskForm
          onCloseModal={() => setIsOpen()}
          onCreateTask={onCreateTask}
          handleDeleteTask={handleDeleteTask}
          taskToEdit={taskToEdit}
          usersList={usersList}
          confirmButtonText={confirmButtonText}
        />
      </SheetContent>
    </Sheet>
  );
};
