import { useToast } from "@/components/ui/use-toast";
import { useUsersStore } from "@/store/usersStore";
import React, { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { BY_USER_ENDPOINT, projectRequests } from "@/requests/ProjectRequests";
import { IProject, ITask } from "@/interfaces";
import ProjectPreviewBox from "../Project/AllProjectsPage/ProjectPreviewBox";
import { taskRequests } from "@/requests/TaskRequests";
import { Else, If, Then, When } from "react-if";
import Task from "@/components/Task/Task";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

interface IDataCarousel<T> {
  data: T[];
  type: "Tasks" | "Projects";
}

export const DataCarousel: React.FC<IDataCarousel<any>> = ({ data, type }) => {
  const navigate = useNavigate();

  return (
    <If condition={data.length > 0}>
      <Then>
        <Carousel className="w-full max-w-md ">
          <div className=" flex justify-center items-center">
            <CarouselPrevious />
            <CarouselContent className="">
              {data.map((item, index) => (
                <CarouselItem
                  className="  flex items-center justify-center  "
                  key={index}
                >
                  <If condition={type === "Projects"}>
                    <Then>
                      <ProjectPreviewBox
                        className="w-full h-full"
                        project={item}
                        isMyProject={true}
                      />
                    </Then>
                    <Else>
                      <Task
                        task={item}
                        setTaskToEdit={(task: ITask) => {}}
                        isMyTasks={true}
                      />
                    </Else>
                  </If>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
          </div>
        </Carousel>
      </Then>
      <Else>
        <div className="flex flex-col">
          <div className=" h-32 w-32 flex-center p-4">
            <p className="text-center text-gray-500">No {type} found.</p>
          </div>
          <If condition={type === "Projects"}>
            <Then>
              <Button onClick={() => navigate("/allProjects")}>
                Create/Join a Project
              </Button>
            </Then>
          </If>
        </div>
      </Else>
    </If>
  );
};

const threeDaysInMilliseconds = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

export const HomePage = () => {
  const { activeUser } = useUsersStore();
  const { toast } = useToast();

  const [userProjects, setUserProjects] = useState<IProject[]>([]);
  const [userTasks, setUserTasks] = useState<ITask[]>([]);

  const checkForUpcomingDeadlines = (userProjects: IProject[]) => {
    for (let i = 0; i < userProjects.length; i++) {
      const project = userProjects[i];
      if (project.deadline?.endDate) {
        const deadline = new Date(project.deadline.endDate);
        const now = new Date();
        const timeDifference = deadline.getTime() - now.getTime();

        if (timeDifference > 0 && timeDifference <= threeDaysInMilliseconds) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    projectRequests
      .getItemsByRequest(activeUser?._id!, BY_USER_ENDPOINT)
      .then((projects) => {
        setUserProjects(projects);
        const showedNotification =
          secureLocalStorage.getItem("deadline-update");
        const isDeadline = checkForUpcomingDeadlines(projects);
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
    <div className=" flex flex-col m-8 gap-2 ">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold">
          Hello {activeUser?.name || "User"}
        </div>
        <Button onClick={() => console.log("Go to profile page")}>
          My Profile
        </Button>
      </div>
      <div className=" flex items-center justify-between h-96">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-semibold">Upcoming Projects</span>
          <div className="border  rounded p-4">
            <DataCarousel type="Projects" data={userProjects || []} />
          </div>
        </div>
        <Calendar />
      </div>
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-semibold">Upcoming Tasks</span>
          <div className="border  rounded p-4">
            <DataCarousel type="Tasks" data={userTasks || []} />
          </div>
        </div>
        <div className="flex flex-col justify-center items-start w-[300px]   ">
          <span className="text-xl font-semibold">Statistics</span>
          <div className="flex flex-col justify-center border w-full p-4">
            <div className=" flex justify-between items-center">
              <span>Projects:</span>
              <span>{userProjects.length}</span>
            </div>
            <div className=" flex justify-between items-center">
              <span>Tasks:</span>
              <span>{userTasks.length}</span>
            </div>
            <div className=" flex justify-between items-center">
              <span>Tasks completed on time:</span>
              <span>5</span>
            </div>
            <div className=" flex justify-between items-center ">
              <span>Missed deadlines:</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
