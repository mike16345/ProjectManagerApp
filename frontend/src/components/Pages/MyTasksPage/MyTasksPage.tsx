import React, { useEffect, useMemo, useState } from "react";
import Task from "../../Task/Task";
import { useUsersStore } from "../../../store/usersStore";
import { IProject, ITask } from "../../../interfaces";
import { BY_USER_ENDPOINT, projectRequests } from "@/requests/ProjectRequests";
import { taskRequests } from "@/requests/TaskRequests";
import { useTasksStore } from "@/store/tasksStore";
import { useProjectsStore } from "@/store/projectsStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Priority } from "@/enums/Priority";
import { Else, If, Then } from "react-if";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";
import { enumToArray } from "@/utils/utils";
import { TaskStatus } from "@/enums/TaskStatus";

const MyTasksPage: React.FC = () => {
  const navigate = useNavigate();

  const { toast } = useToast();

  const { activeUser } = useUsersStore();
  const { setActiveProject } = useProjectsStore();
  const { setTaskToEdit } = useTasksStore();

  const [userTasks, setUserTasks] = useState<ITask[]>([]);
  const [projectTasks, setProjectTasks] = useState<ITask[]>([]);
  const [tasksToDisplay, setTasksToDisplay] = useState<ITask[]>([]);

  const [statusFilter, setStatusFilter] = useState({
    [TaskStatus.TODO]: true,
    [TaskStatus.IN_PROGRESS]: true,
    [TaskStatus.CODE_REVIEW]: true,
    [TaskStatus.DONE]: true,
  });

  const [priorityFilter, setPriorityFilter] = useState({
    [Priority.NONE]: true,
    [Priority.LOW]: true,
    [Priority.HIGH]: true,
    [Priority.EPIC]: true,
  });

  const [projects, setProjects] = useState<IProject[]>([]);

  const [projectToDisplay, setProjectToDisplay] = useState<IProject | null>(
    null
  );

  const fetchMyProjects = async () => {
    if (!activeUser) return;

    await projectRequests
      .getItemsByRequest(activeUser._id, BY_USER_ENDPOINT)
      .then((projects) => {
        setProjects(projects);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUsersTasks = async () => {
    if (!activeUser) return;

    await taskRequests
      .getItemsByRequest(activeUser._id, BY_USER_ENDPOINT)
      .then((tasks) => {
        setUserTasks(tasks);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTaskClick = (task: ITask) => {
    projectRequests
      .getItemRequest(task.project_id)
      .then((project) => {
        setActiveProject(project);
        setTaskToEdit(task);
        navigate("/project_overview");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Could not find task project",
          description: "There was an error finding task project",
          duration: 2000,
          variant: "destructive",
        });
        setTaskToEdit(null);
      });
  };

  useEffect(() => {
    const storedStatusFilter = sessionStorage.getItem("statusFilter");
    const storedPriorityFilter = sessionStorage.getItem("priorityFilter");
    const projToDisplay = sessionStorage.getItem("projectToDisplay");

    getUsersTasks();
    fetchMyProjects();

    if (storedStatusFilter) {
      setStatusFilter(JSON.parse(storedStatusFilter));
    }

    if (storedPriorityFilter) {
      setPriorityFilter(JSON.parse(storedPriorityFilter));
    }

    if (projToDisplay) {
      setProjectToDisplay(JSON.parse(projToDisplay));
    }
  }, []);

  useEffect(() => {
    if (projectToDisplay) return;

    if (projects.length > 0) {
      setProjectToDisplay(projects[0]);
    }
  }, [projects]);

  useEffect(() => {
    sessionStorage.setItem("statusFilter", JSON.stringify(statusFilter));
  }, [statusFilter]);

  useEffect(() => {
    sessionStorage.setItem("priorityFilter", JSON.stringify(priorityFilter));
  }, [priorityFilter]);

  useEffect(() => {
    if (!projectToDisplay || userTasks.length == 0) return;
    const projTasks = userTasks.filter(
      (task) => task.project_id === projectToDisplay._id
    );
    setProjectTasks(projTasks);
    sessionStorage.setItem(
      "projectToDisplay",
      JSON.stringify(projectToDisplay)
    );
  }, [projectToDisplay, userTasks]);

  useMemo(() => {
    const filteredTasks = projectTasks.filter((task) => {
      return statusFilter[task.status] && priorityFilter[task.priority];
    });

    setTasksToDisplay(filteredTasks);
  }, [priorityFilter, projectTasks, statusFilter]);

  return (
    <div className=" flex flex-col gap-4 justify-start m-6">
      <div className="flex items-center justify-between">
        <div className=" text-3xl font-extrabold ">My Tasks</div>
        <div className=" flex  gap-4 items-center">
          <Select
            onValueChange={(value) => setProjectToDisplay(JSON.parse(value))}
          >
            <SelectTrigger className=" w-52 ring-0 focus:ring-0 focus:border-2">
              <Button variant="outline" className=" w-52">
                <FilterIcon size={15} className="mr-2 " /> Choose project to
                view
              </Button>
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              {projects.map((project, index) => (
                <SelectItem
                  className="cursor-pointer"
                  key={index}
                  value={JSON.stringify(project)}
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" w-52">
                <FilterIcon size={15} className="mr-2" /> Filter By Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              {enumToArray(Priority).map(
                (priority: keyof typeof priorityFilter, index) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={index}
                      onSelect={(e) => e.preventDefault()}
                      className="capitalize"
                      checked={priorityFilter[priority]}
                      onCheckedChange={(value) =>
                        setPriorityFilter({
                          ...priorityFilter,
                          [priority]: value,
                        })
                      }
                    >
                      {priority}
                    </DropdownMenuCheckboxItem>
                  );
                }
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" w-52">
                <FilterIcon size={15} className="mr-2" /> Filter By Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              {enumToArray(TaskStatus).map(
                (status: keyof typeof statusFilter, index) => {
                  return (
                    <DropdownMenuCheckboxItem
                      onSelect={(e) => e.preventDefault()}
                      key={index}
                      className="capitalize"
                      checked={statusFilter[status]}
                      onCheckedChange={(value) =>
                        setStatusFilter({ ...statusFilter, [status]: value })
                      }
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  );
                }
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <div>
          <div className="flex flex-col gap-4">
            <p className=" text-xl font-semibold">
              Project: {projectToDisplay && projectToDisplay.name}
            </p>
            <div
              className={`flex flex-wrap gap-6 max-h-[60vh] overflow-y-auto border p-2 ${
                tasksToDisplay.length === 0 &&
                " items-center justify-center h-[25vh] "
              }`}
            >
              <If condition={tasksToDisplay.length > 0}>
                <Then>
                  {tasksToDisplay.map((task, index) => (
                    <Task
                      task={task}
                      setTaskToEdit={(task: ITask) => handleTaskClick(task)}
                      key={index}
                      isMyTasks={true}
                    />
                  ))}
                </Then>
                <Else>
                  <p className="text-muted-foreground ">No tasks found</p>
                </Else>
              </If>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasksPage;
