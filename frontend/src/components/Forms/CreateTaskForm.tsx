import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ITask, Option } from "@/interfaces";
import { TaskStatus } from "@/enums/TaskStatus";
import { When } from "react-if";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Priority } from "@/enums/Priority";
import MenuSelection from "../Menu/MenuSelection";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../ui/select";
import Task from "../Task/Task";
import { useProjectsStore } from "@/store/projectsStore";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  priority: z.string(),
  description: z
    .string()
    .min(10, {
      message: "Task description must be at least 2 characters.",
    })
    .max(250, {
      message: "Task description must be less than 250 characters.",
    }),
  assignee: z
    .string()
    .email({ message: "Task assignee must be a valid email address." }),
  status: z.string(),
});
interface CreateTaskFormProps {
  onCloseModal: () => void;
  taskToEdit?: ITask | null;
  usersList: string[];
  confirmButtonText: string;
  onCreateTask: (task: ITask) => void;
  handleDeleteTask: (taskId: number) => void;
}
export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onCloseModal,
  handleDeleteTask,
  onCreateTask,
  taskToEdit,
  usersList,
  confirmButtonText,
}) => {
  const { activeProject } = useProjectsStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: taskToEdit?.name || "",
      description: taskToEdit?.description || "",
      assignee: taskToEdit?.assignee || "",
      status: taskToEdit?.status || TaskStatus.TODO,
      priority: taskToEdit?.priority || Priority.NONE,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const task: ITask = {
      name: values.name,
      assignee: values.assignee,
      priority: values.priority as Priority,
      description: values.description,
      status: values.status as TaskStatus,
      task_id: taskToEdit?.task_id || Date.now().valueOf(),
      project_id: taskToEdit?.project_id || activeProject?._id!,
    };

    onCreateTask(task);
    onCloseModal();
  }

  const onDeleteClick = () => {
    handleDeleteTask(taskToEdit?.task_id!);
    onCloseModal();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-2 max-h-[80vh] overflow-y-scroll"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input
                  className="  focus-visible:ring-0 focus-visible:border-black"
                  placeholder="Task Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Textarea
                  className="  focus-visible:ring-0 focus-visible:border-black"
                  placeholder="Task Description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
                <Input placeholder="Assignee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input placeholder="Select Assignee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger>
                    <SelectValue defaultValue={field.value} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TaskStatus).map((status, index) => (
                      <SelectItem key={index} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <When condition={taskToEdit !== null}>
            <Button variant={"destructive"} onClick={onDeleteClick}>
              Delete
            </Button>
          </When>
          <Button type="submit">
            {confirmButtonText ? confirmButtonText : "Create task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
