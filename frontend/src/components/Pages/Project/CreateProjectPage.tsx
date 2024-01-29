import { ProjectType } from "../../../enums/ProjectType";
import { IProject, IUser, Option } from "../../../interfaces";
import { enumToArray } from "../../../utils/utils";
import { useUsersStore } from "../../../store/usersStore";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { When } from "react-if";
import { createProject, updateProjectById } from "../../../API/ProjectAPIcalls";
import { useProjectsStore } from "../../../store/projectsStore";
import "react-datepicker/dist/react-datepicker.css";
import UserSelectMenu from "../../Menu/UserSelectMenu";
import { editUser } from "../../../API/UserAPIcalls";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Profile } from "@/components/Profile/Profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const TODAY = new Date();

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(20, { message: "Name must be under 20 characters." }),
  users: z.array(z.string()),
  deadline: z
    .object({ startDate: z.date(), endDate: z.date().optional() })
    .optional(),
  projectLead: z.string(),
  description: z.string().optional(),
  projectType: z.string(),
});

export const CreateProjectPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { activeUser, users } = useUsersStore();

  const { projects, setActiveProject, setProjects } = useProjectsStore();
  const [deadline, setDeadline] = useState(false);
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

    console.log("project Lead: ", projectLead);
    console.log("users: ", users);

    const project: IProject = {
      name: values.name,
      users: projectUsers,
      projectLead: projectLead,
      projectType: values.projectType as ProjectType,
      description: values.description || "",
      deadline: values.deadline,
    };

    handleCreateProject(project);
  }

  const filterUsers = (available: boolean) => {
    const filtered = users.filter((user) =>
      available
        ? !projectUsers.some((projectUser) => projectUser._id === user._id)
        : projectUsers.some((projectUser) => projectUser._id === user._id)
    );
    console.log("filtered users: ", filtered);
    return filtered;
  };

  const [availableUsers, setAvailableUsers] = useState(filterUsers(true));

  const [dateRange, setDateRange] = useState([TODAY, null]);
  const [startDate, endDate] = dateRange;

  const projectTypesOptions: Option[] = enumToArray(ProjectType).map((type) => {
    return {
      name: type,
      value: type,
    };
  });

  const handleDeadlineChange = (nextValue: string) => {
    setDeadline(nextValue === "true");
  };

  const handleSetDeadlineRange = (dateRange: [Date, Date | null]) => {
    if (deadline) {
      setDateRange(dateRange);
      return { startDate: dateRange[0], endDate: dateRange[1] };
    }
  };

  const handleCreateProject = async (newProject: IProject) => {
    const project = await createProject(newProject);
    setProjects([...projects, project]);
    setActiveProject(project);

    newProject.users.forEach(async (user) => {
      user.projects = [...user.projects, project._id!];
      const res = await editUser(user);
    });

    toast({
      title: "Successfully created project",
      variant: "success",
      duration: 2000,
    });

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
                <FormLabel>Task Description</FormLabel>
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
          {/* <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Description</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={handleDeadlineChange}
                    value={!deadline ? "false" : "true"}
                    className=" flex-center gap-2"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value={"false"} />
                        <FormLabel className="text-sm">No</FormLabel>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value={"true"} />
                        <FormLabel className="text-sm">Yes</FormLabel>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                  <When condition={deadline}>
                    <DatePicker
                      onChange={(range) =>
                        form.setValue("deadline", handleSetDeadlineRange(range))
                      }
                      minDate={TODAY}
                      dateFormat={"dd/MM/yyyy"}
                      showIcon={true}
                      value={`${startDate?.toDateString()} - ${
                        endDate ? endDate.toDateString() : ""
                      }`}
                      className=" border rounded w-1/4  text-black cursor-pointer"
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      withPortal
                    />
                  </When>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
