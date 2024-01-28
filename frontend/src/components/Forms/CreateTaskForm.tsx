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
import { ITask, IUser } from "@/interfaces";
import { TaskStatus } from "@/enums/TaskStatus";
import { When } from "react-if";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Priority } from "@/enums/Priority";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../ui/select";
import { useProjectsStore } from "@/store/projectsStore";
import { useState } from "react";
import { Avatar, Text } from "@chakra-ui/react";

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
  taskType: TaskStatus;
  confirmButtonText: string;
  onCreateTask: (task: ITask) => void;
  availableUsers: Array<IUser>;
  handleDeleteTask: (taskId: number) => void;
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  taskType,
  onCloseModal,
  handleDeleteTask,
  onCreateTask,
  taskToEdit,
  availableUsers,
  confirmButtonText,
}) => {
  const { activeProject } = useProjectsStore();
  const [assignee, setAssignee] = useState<IUser | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: taskToEdit?.name || "",
      description: taskToEdit?.description || "",
      assignee: taskToEdit?.assignee || "",
      status: taskToEdit?.status || taskType,
      priority: taskToEdit?.priority || Priority.NONE,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const task: ITask = {
      name: values.name,
      assignee: assignee?.email || "none@gmail.com",
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
              <div className="flex flex-col gap-2">
                <FormLabel>Assignee</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger className="ring-0 flex  py-4 items-center focus:ring-0 focus:border-2 focus-visible:border-black">
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user, index) => {
                        return (
                          <SelectItem
                            className="max-h-[250px] overflow-y-auto"
                            key={index}
                            value={user.email}
                          >
                            <div className="flex items-center justify-center">
                              <Avatar
                                size={"sm"}
                                borderRadius="full"
                                src={user.picture}
                                mr={2}
                              />
                              <div className="flex flex-col justify-center items-start">
                                <Text className="text-sm font-semibold">
                                  {user.name}
                                </Text>
                                <span className="text-sm opacity-75 text-gray-600">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {/* <UserSelectMenu
                    users={availableUsers}
                    defaultValue={"Assign To"}
                    onSelect={(value: IUser) => setAssignee(value)}
                  /> */}
                </FormControl>
              </div>
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
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger className="ring-0 focus:ring-0 focus:border-2">
                    <SelectValue defaultValue={field.value} />
                  </SelectTrigger>
                  <SelectContent className="cursor-pointer">
                    {Object.values(Priority).map((priority, index) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={index}
                        value={priority}
                      >
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <SelectTrigger className=" focus:ring-0 focus:border-2">
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