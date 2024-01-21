import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { ProjectType } from "../../../enums/ProjectType";
import MenuSelection from "../../Menu/MenuSelection";
import { IProject, IUser, Option } from "../../../interfaces";
import { enumToArray } from "../../../utils/utils";
import { useUsersStore } from "../../../store/usersStore";
import { FormEvent, useState } from "react";
import DatePicker from "react-datepicker";
import { When } from "react-if";
import { createProject } from "../../../API/ProjectAPIcalls";
import { useProjectsStore } from "../../../store/projectsStore";
import "react-datepicker/dist/react-datepicker.css";

interface ProjectFieldProps {
  children: React.ReactNode;
  fieldName: string;
  helperText?: string;
  isRequired?: boolean;
}

const ProjectField: React.FC<ProjectFieldProps> = ({
  children,
  fieldName,
  isRequired,
  helperText,
}) => {
  return (
    <Flex flexDirection={"column"} gap={2} className=" w-full">
      <FormControl isRequired={isRequired}>
        <FormLabel htmlFor={fieldName}>{fieldName}</FormLabel>
        {children}
      </FormControl>
      <When condition={helperText}>
        <FormHelperText>{helperText}</FormHelperText>
      </When>
    </Flex>
  );
};

export const CreateProjectPage = () => {
  const { activeUser, users } = useUsersStore();
  const { projects, setProjects } = useProjectsStore();
  const [deadline, setDeadline] = useState(false);

  const [newProject, setNewProject] = useState<IProject>({
    name: "",
    users: [activeUser!],
    deadline: null,
    projectLead: activeUser!,
    description: "",
    projectType: ProjectType.FREESTYLE,
  });

  const projectTypesOptions: Option[] = enumToArray(ProjectType).map((type) => {
    return {
      name: type,
      value: type,
    };
  });

  const userEmails: Option[] = users.map((user) => {
    return {
      name: user.email,
      value: user,
    };
  });

  const TODAY = new Date();
  const [dateRange, setDateRange] = useState([TODAY, null]);
  const [startDate, endDate] = dateRange;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleDeadlineChange = (nextValue: string) => {
    setDeadline(nextValue === "true");
  };

  const handleSetDeadlineRange = (dateRange: [Date, Date | null]) => {
    if (deadline) {
      setDateRange(dateRange);

      setNewProject({
        ...newProject,
        deadline: { startDate: dateRange[0], endDate: dateRange[1] },
      });
    }
  };

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    const project = await createProject(newProject);
    console.log("project", project);
    setProjects([...projects, project]);
  };

  return (
    <form onSubmit={handleCreateProject}>
      <Flex
        margin={8}
        className=" w-screen h-screen"
        gap={4}
        flexDirection={"column"}
        justifyContent={"start"}
        alignItems={"start"}
      >
        <ProjectField isRequired={true} fieldName="Project Name">
          <InputGroup>
            <Input
              onChange={handleChange}
              name="name"
              className="w-1/2"
              isRequired={true}
              placeholder="Project Name"
            />
          </InputGroup>
        </ProjectField>

        <ProjectField fieldName="Project Description">
          <InputGroup>
            <Input
              onChange={handleChange}
              name="description"
              className=" w-1/2"
              placeholder="Project Description"
            />
          </InputGroup>
        </ProjectField>
        <ProjectField fieldName="Deadline">
          <RadioGroup
            onChange={handleDeadlineChange}
            value={!deadline ? "false" : "true"}
          >
            <Stack direction="row">
              <Radio value={"false"}>No</Radio>
              <Radio value={"true"}>Yes</Radio>
            </Stack>
          </RadioGroup>
          <When condition={deadline}>
            <DatePicker
              onChange={handleSetDeadlineRange}
              minDate={TODAY}
              dateFormat={"dd/MM/yyyy"}
              showIcon={true}
              isClearable={true}
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
        </ProjectField>
        <ProjectField fieldName="Project Type">
          <MenuSelection
            setValue={(value: string) => {
              setNewProject({
                ...newProject,
                projectType: value as ProjectType,
              });
            }}
            defaultValue={newProject.projectType}
            options={projectTypesOptions}
          />
        </ProjectField>
        <ProjectField fieldName="Invite Collaborators">
          <MenuSelection
            setValue={(value: IUser) => {
              setNewProject({
                ...newProject,
                users: [...newProject.users, value],
              });
            }}
            defaultValue={"Select User"}
            options={userEmails}
          />
        </ProjectField>
        <ProjectField fieldName="Project Lead">
          <MenuSelection
            setValue={(value: IUser) => {
              setNewProject({
                ...newProject,
                projectLead: value,
              });
            }}
            defaultValue={newProject.projectLead.name}
            options={
              userEmails.length > 0
                ? userEmails
                : [{ name: "No Users", value: "No Users" }]
            }
          />
        </ProjectField>
        <Button colorScheme="purple" type="submit">
          Create
        </Button>
      </Flex>
    </form>
  );
};
