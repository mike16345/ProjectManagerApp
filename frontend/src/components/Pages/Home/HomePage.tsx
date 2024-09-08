import { useToast } from "@/components/ui/use-toast";
import { useUsersStore } from "@/store/usersStore";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { BY_USER_ENDPOINT, projectRequests } from "@/requests/ProjectRequests";
import { IProject, ITask } from "@/interfaces";
import { taskRequests } from "@/requests/TaskRequests";
import { DataCarousel } from "@/components/DataCarousel/DataCarousel";
import { isDeadlineNear } from "@/utils/utils";

export const HomePage = () => {
  const { activeUser } = useUsersStore();

  const { toast } = useToast();

  const [userProjects, setUserProjects] = useState<IProject[]>([]);
  const [userTasks, setUserTasks] = useState<ITask[]>([]);
  const [deadlines, setDeadlines] = useState<Date[]>([]);

  const deadlineStyle = {
    backgroundColor: "red",
    borderRadius: "9999px",
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
    const showedNotification = sessionStorage.getItem("deadline-update");
    const showedWelcomeNotification = sessionStorage.getItem(
      "welcome-notification"
    );

    projectRequests
      .getItemsByRequest(activeUser?._id!, BY_USER_ENDPOINT)
      .then((projects) => {
        const isDeadline = checkForUpcomingDeadlines(projects);

        setUserProjects(projects);
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
            variant: isDeadline ? "destructive" : "default",
            duration: 5000,
          });

          sessionStorage.setItem("deadline-update", "true");
        }
      });

    taskRequests
      .getItemsByRequest(activeUser?._id!, BY_USER_ENDPOINT)
      .then((task) => {
        setUserTasks(task);
      });

    if (!showedWelcomeNotification) {
      toast({
        title: `Welcome back ${activeUser?.name || "User"}!`,
        duration: 1000,
      });
      sessionStorage.setItem("welcome-notification", "true");
    }
  }, []);

  return (
    <div className="px-8 py-4">
      <div className="text-3xl font-bold ">
        Hello {activeUser?.name || "User"}
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 place-items-center  gap-4 ">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">Upcoming Projects</span>
            <div className="">
              <DataCarousel type="Projects" data={userProjects || []} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold">Upcoming Tasks</span>
            <div className="">
              <DataCarousel type="Tasks" data={userTasks || []} />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-xl font-semibold ">Deadlines</div>
          <Calendar
            className="p-1"
            modifiers={{ deadline: deadlines }}
            modifiersStyles={{ deadline: deadlineStyle }}
          />
          <div className="flex flex-col justify-center gap-2 items-start w-[300px]   ">
            <span className="text-xl font-semibold">Statistics</span>
            <div className="flex flex-col justify-center border w-full p-3">
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
