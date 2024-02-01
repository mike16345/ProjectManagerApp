import { useToast } from "@/components/ui/use-toast";
import { useUsersStore } from "@/store/usersStore";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { BY_USER_ENDPOINT, projectRequests } from "@/requests/ProjectRequests";
import { IProject, ITask } from "@/interfaces";
import { taskRequests } from "@/requests/TaskRequests";
import { DataCarousel } from "@/components/DataCarousel/DataCarousel";
import { isDeadlineNear } from "@/utils/utils";
import secureLocalStorage from "react-secure-storage";

export const HomePage = () => {
  const { activeUser } = useUsersStore();

  const { toast } = useToast();

  const [userProjects, setUserProjects] = useState<IProject[]>([]);
  const [userTasks, setUserTasks] = useState<ITask[]>([]);
  const [deadlines, setDeadlines] = useState<Date[]>([]);

  const deadlineStyle = {
    backgroundColor: "red",
    "border-radius": "9999px",
  };

  const checkForUpcomingDeadlines = (userProjects: IProject[]) => {
    for (let i = 0; i < userProjects.length; i++) {
      const project = userProjects[i];
      if (project.deadline?.endDate) {
        const deadline = new Date(project.deadline.endDate);
        const isDeadline = isDeadlineNear(deadline);

        if (isDeadline) {
          return true;
        }
      }
    }
    return false;
  };

  const getDeadlineDays = (userProjects: IProject[]) => {
    const deadlines = userProjects
      .map((proj) => {
        if (proj.deadline && proj.deadline.endDate !== undefined) {
          return proj.deadline.endDate;
        }
      })
      .filter((date) => date !== undefined)
      .map((date) => {
        return new Date(date!);
      });

    setDeadlines(deadlines);
  };

  useEffect(() => {
    projectRequests
      .getItemsByRequest(activeUser?._id!, BY_USER_ENDPOINT)
      .then((projects) => {
        setUserProjects(projects);
        const showedNotification =
          secureLocalStorage.getItem("deadline-update");
        const isDeadline = checkForUpcomingDeadlines(projects);
        getDeadlineDays(projects);
        if (!showedNotification) {
          toast({
            title: `${
              isDeadline
                ? "You have an upcoming deadline!"
                : "No upcoming deadlines"
            }`,
            description: `${
              isDeadline
                ? "Check your calendar!"
                : "No deadlines in the next few days!"
            }`,
            variant: isDeadline ? "destructive" : "success",
            duration: 5000,
          });

          secureLocalStorage.setItem("deadline-update", "true");
        }
      });

    taskRequests
      .getItemsByRequest(activeUser?._id!, BY_USER_ENDPOINT)
      .then((task) => {
        setUserTasks(task);
      });

    toast({
      title: `Welcome back ${activeUser?.name || "User"}!`,
      duration: 1000,
    });
  }, []);

  return (
    <div>
      <div className="text-3xl font-bold m-6">
        Hello {activeUser?.name || "User"}
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 place-items-center m-8 gap-8 ">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">Upcoming Projects</span>
            <div className="border  rounded p-4">
              <DataCarousel type="Projects" data={userProjects || []} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">Upcoming Tasks</span>
            <div className="border  rounded p-4">
              <DataCarousel type="Tasks" data={userTasks || []} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold ">Deadlines</div>
          <Calendar
            modifiers={{ deadline: deadlines }}
            modifiersStyles={{ deadline: deadlineStyle }}
          />
          <div className="flex flex-col justify-center items-start w-[300px]   ">
            <span className="text-xl font-semibold">Statistics</span>
            <div className="flex flex-col justify-center border w-full p-4">
              <div className=" flex justify-between items-center">
                <span>Projects:</span>
                <span>{userProjects.length}</span>
              </div>
              <div className=" flex justify-between ">
                <span>Tasks:</span>
                <span>{userTasks.length}</span>
              </div>
              <div className=" flex justify-between items-center">
                <span>Tasks completed on time:</span>
                <span>5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
