import { ProjectType } from "../../../enums/ProjectType";
import { IProject, IUser, Option } from "../../../interfaces";
import { enumToArray } from "../../../utils/utils";
import { useUsersStore } from "../../../store/usersStore";
import { useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";
import { useProjectsStore } from "../../../store/projectsStore";
import "react-datepicker/dist/react-datepicker.css";
import UserSelectMenu from "../../Menu/UserSelectMenu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/components/Profile/Profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { projectRequests } from "@/requests/ProjectRequests";
import { userRequests } from "@/requests/UserRequests";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

const TODAY = new Date();

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(20, { message: "Name must be under 20 characters." }),
  users: z.array(z.string()),
  deadline: z.object({ startDate: z.date(), endDate: z.date() }).nullish(),
  projectLead: z.string(),
  description: z.string().optional(),
  projectType: z.string(),
});

export const CreateProjectPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { activeUser, users, setUsers } = useUsersStore();

  const { projects, setActiveProject, setProjects } = useProjectsStore();
  const [deadline, setDeadline] = useState(false);

  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  const [projectUsers, setProjectUsers] = useState<IUser[]>([activeUser!]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      users: [JSON.stringify(activeUser)],
      projectLead: JSON.stringify(activeUser),
      projectType: ProjectType.PERSONAL,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values: ", values);
    const projectLead = JSON.parse(values.projectLead);

    const project: IProject = {
      name: values.name,
      users: projectUsers,
      projectLead: projectLead,
      projectType: values.projectType as ProjectType,
      description: values.description || "",
      deadline:
        date.from && date.to && deadline
          ? { startDate: date.from, endDate: date.to }
          : null,
    };

    handleCreateProject(project);
  }

  const filterUsers = (available: boolean) => {
    const filtered = users.filter((user) =>
      available
        ? !projectUsers.some((projectUser) => projectUser._id === user._id)
        : projectUsers.some((projectUser) => projectUser._id === user._id)
    );
    return filtered;
  };

  const [availableUsers, setAvailableUsers] = useState(filterUsers(true));

  const projectTypesOptions: Option[] = enumToArray(ProjectType).map((type) => {
    return {
      name: type,
      value: type,
    };
  });

  const handleCreateProject = async (newProject: IProject) => {
    try {
      const project = await projectRequests.addItemRequest(newProject);
      console.log("project", project);
      setProjects([...projects, project]);
      setActiveProject(project);
      newProject.users.forEach((user) => {
        user.projects = [...user.projects, project._id!];
      });

      await userRequests.bulkEditItemsRequest(newProject.users);
      await userRequests.getItemsRequest().then((users) => {
        setUsers(users);
      });
      toast({
        title: "Successfully created project",
        variant: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to create project",
        variant: "destructive",
        duration: 2000,
      });
    }

    navigate("/project_overview");
  };

  useEffect(() => {
    setAvailableUsers(filterUsers(true));
  }, [projectUsers]);

  return (
    <Form {...form}>
      <form
        className=" w-screen h-screen"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className=" m-8 gap-4 flex flex-col justify-start items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    className=" w-1/2 focus-visible:ring-0 focus-visible:border-primary"
                    placeholder="Project Name"
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
              <FormItem className="w-full">
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea
                    className=" w-1/2 focus-visible:ring-0 focus-visible:border-primary"
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
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Deadline</FormLabel>
                <div className={cn("grid gap-2")}>
                  <When condition={deadline}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          disabled={{ before: TODAY }}
                          fromMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </When>
                  <Button
                    type="button"
                    className="mt-1 w-40"
                    onClick={() => setDeadline(() => !deadline)}
                  >
                    {!deadline ? "Set deadline" : "No deadline"}
                  </Button>
                </div>
                <FormDescription>
                  <p className="text-sm text-muted-foreground">
                    Deadline is optional.
                  </p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger className="ring-0 focus:ring-0 focus:border-2">
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent className="cursor-pointer">
                      {projectTypesOptions.map((projectType, index) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={index}
                          value={projectType.value as string}
                        >
                          {projectType.value as string}
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
            name="users"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite collaborators</FormLabel>
                <FormControl>
                  <UserSelectMenu
                    onSelect={(user: IUser) => {
                      setProjectUsers([...projectUsers, user]);
                      toast({
                        title: `Added ${user.email} to project`,
                        duration: 2000,
                        variant: "success",
                      });
                    }}
                    defaultValue={"Invite Users"}
                    users={availableUsers}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectLead"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2">
                  <FormLabel>Project Lead</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={
                            "h-14 justify-between text-muted-foreground"
                          }
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
                            {projectUsers.map((user, index) => {
                              return (
                                <CommandItem
                                  key={index}
                                  className=" cursor-pointer"
                                  value={JSON.stringify(user)}
                                  onSelect={() => {
                                    form.setValue(
                                      "projectLead",
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
          <Button type="submit">Create project</Button>
        </div>
      </form>
    </Form>
  );
};
