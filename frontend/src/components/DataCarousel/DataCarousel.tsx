import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ITask } from "@/interfaces";
import ProjectPreviewBox from "@/components/Pages/Project/AllProjectsPage/ProjectPreviewBox";
import { Else, If, Then } from "react-if";
import Task from "@/components/Task/Task";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useTasksStore } from "@/store/tasksStore";
import { useProjectsStore } from "@/store/projectsStore";
import { projectRequests } from "@/requests/ProjectRequests";

interface IDataCarousel<T> {
  data: T[];
  type: "Tasks" | "Projects";
}

export const DataCarousel: React.FC<IDataCarousel<any>> = ({ data, type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setActiveProject } = useProjectsStore();
  const { setTaskToEdit } = useTasksStore();
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
                        setTaskToEdit={(task: ITask) => handleTaskClick(task)}
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
