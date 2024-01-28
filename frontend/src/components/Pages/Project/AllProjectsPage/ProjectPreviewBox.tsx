import { useNavigate } from "react-router-dom";
import { IProject } from "../../../../interfaces";
import { useProjectsStore } from "../../../../store/projectsStore";
import { Button } from "@/components/ui/button";
import { Else, If, Then, When } from "react-if";
import { useUsersStore } from "@/store/usersStore";
import secureLocalStorage from "react-secure-storage";

interface IProjectPreviewBox {
  isMyProject: boolean;
  project: IProject;
}
const ProjectPreviewBox: React.FC<IProjectPreviewBox> = ({
  project,
  isMyProject,
}) => {
  const navigate = useNavigate();
  const { setActiveProject } = useProjectsStore();
  const { activeUser } = useUsersStore();

  const onProjectClickHandler = () => {
    setActiveProject(project);
    secureLocalStorage.setItem("active-project", JSON.stringify(project));
    navigate("/project_overview");
  };

  return (
    <div
      onClick={onProjectClickHandler}
      className={`flex flex-col border-2 hover:shadow-lg rounded p-2 gap-4 w-52  cursor-pointer   `}
    >
      <div className="flex flex-col items-start justify-between">
        <span className="font-semibold text-lg">{project.name}</span>
        <span className="text-sm">{project.date_created?.slice(0, 10)!}</span>
      </div>
      <If condition={!isMyProject}>
        <Then>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked project");
            }}
            size={"sm"}
          >
            Request to join
          </Button>
        </Then>
        <Else>
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                console.log("clicked project");
              }}
              size={"sm"}
            >
              Leave
            </Button>
            <When
              condition={
                activeUser && activeUser._id == project.projectLead._id
              }
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("clicked project");
                }}
                variant={"destructive"}
                className="flex-grow"
                size={"sm"}
              >
                Delete
              </Button>
            </When>
          </div>
        </Else>
      </If>
    </div>
  );
};

export default ProjectPreviewBox;
