import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CreateTaskForm } from "../Forms/CreateTaskForm";
import { ITask, IUser } from "@/interfaces";
import { TaskStatus } from "@/enums/TaskStatus";

interface CreateTaskNewProps {
  isOpen: boolean;
  setIsOpen: () => void;
  taskType: TaskStatus;
  taskToEdit?: ITask | null;
  confirmButtonText: string;
  availableUsers: Array<IUser>;
  onCreateTask: (task: ITask) => void;
  handleDeleteTask: (taskId: string) => void;
}

export const CreateTask: React.FC<CreateTaskNewProps> = ({
  isOpen,
  setIsOpen,
  availableUsers,
  onCreateTask,
  taskToEdit,
  taskType,
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
          availableUsers={availableUsers}
          taskType={taskType}
          onCloseModal={() => setIsOpen()}
          onCreateTask={onCreateTask}
          handleDeleteTask={handleDeleteTask}
          taskToEdit={taskToEdit}
          confirmButtonText={confirmButtonText}
        />
      </SheetContent>
    </Sheet>
  );
};
