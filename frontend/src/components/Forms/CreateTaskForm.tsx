import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Profile } from "../Profile/Profile";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  priority: z.string(),
  description: z
    .string()
    .max(250, {
      message: "Task description must be less than 250 characters.",
    })
    .optional(),
  assignee: z.string(),
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
  const [taskTypeToAdd, setTaskTypeToAdd] = useState(taskType);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: taskToEdit?.name || "",
      description: taskToEdit?.description || undefined,
      assignee: taskToEdit ? JSON.stringify(taskToEdit?.assignee) : undefined,
      status: taskToEdit?.status || taskTypeToAdd,
      priority: taskToEdit?.priority || Priority.NONE,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const assignee = JSON.parse(values.assignee);
    const task: ITask = {
      name: values.name,
      assignee: assignee || ({} as IUser),
      priority: values.priority as Priority,
      description: values.description || "",
      status: values.status as TaskStatus,
      project_id: taskToEdit?.project_id || activeProject?._id!,
    };

    onCreateTask(task);
    onCloseModal();
  }

  const onDeleteClick = () => {
    handleDeleteTask(taskToEdit?._id!);
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
                  className="  focus-visible:ring-0 focus-visible:border-primary"
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
                  className="  focus-visible:ring-0 focus-visible:border-primary"
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={"h-14 justify-between text-muted-foreground"}
                      >
                        {field.value ? (
                          <div className="flex items-center justify-center">
                            <Profile
                              className="mr-2"
                              user={JSON.parse(field.value)}
                            />
                            <div className="flex flex-col justify-center items-start">
                              <span className="text-sm font-semibold">
                                {JSON.parse(field.value).name}
                              </span>
                              <span className="text-sm opacity-75 text-gray-600">
                                {JSON.parse(field.value).email}
                              </span>
                            </div>
                          </div>
                        ) : (
                          "Select user"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command onValueChange={field.onChange}>
                      <CommandInput placeholder="Search user..." />
                      <ScrollArea className=" h-48">
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {availableUsers.map((user, index) => {
                            return (
                              <CommandItem
                                key={index}
                                className=" cursor-pointer"
                                value={JSON.stringify(user)}
                                onSelect={() => {
                                  form.setValue(
                                    "assignee",
                                    JSON.stringify(user)
                                  );
                                }}
                              >
                                <div className="flex items-center justify-center">
                                  <Profile className="mr-2" user={user} />
                                  <div className="flex flex-col justify-center items-start">
                                    <span className="text-sm font-semibold">
                                      {user.name}
                                    </span>
                                    <span className="text-sm opacity-75 text-gray-600">
                                      {user.email}
                                    </span>
                                  </div>
                                </div>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    JSON.stringify(user) === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                <Select
                  onValueChange={(e) => {
                    setTaskTypeToAdd(e as TaskStatus);
                    field.onChange(e);
                  }}
                  {...field}
                >
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
