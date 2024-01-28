import {
  Button,
  EditableTextarea,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ProjectType } from "../../../enums/ProjectType";
import MenuSelection from "../../Menu/MenuSelection";
import { IProject, IUser, Option } from "../../../interfaces";
import { enumToArray } from "../../../utils/utils";
import { useUsersStore } from "../../../store/usersStore";
import { FormEvent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { When } from "react-if";
import { createProject, updateProjectById } from "../../../API/ProjectAPIcalls";
import { useProjectsStore } from "../../../store/projectsStore";
import "react-datepicker/dist/react-datepicker.css";
import UserSelectMenu from "../../Menu/UserSelectMenu";
import { editUser } from "../../../API/UserAPIcalls";
import { useNavigate } from "react-router-dom";

interface ProjectFieldProps {
  children: React.ReactNode;
  fieldName: string;
  helperText?: string;
  isRequired?: boolean;
}
const TODAY = new Date();

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
  const toast = useToast();
  const navigate = useNavigate();
  const { activeUser, users } = useUsersStore();
  const { projects, setActiveProject, setProjects } = useProjectsStore();
  const [deadline, setDeadline] = useState(false);

  const [newProject, setNewProject] = useState<IProject>({
    name: "",
    users: [activeUser!],
    deadline: null,
    projectLead: activeUser!,
    description: "",
    projectType: ProjectType.FREESTYLE,
  });

  const filterUsers = (available: boolean) => {
    const filtered = users.filter((user) =>
      available
        ? !newProject.users.some((projectUser) => projectUser._id === user._id)
        : newProject.users.some((projectUser) => projectUser._id === user._id)
    );

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    setProjects([...projects, project]);
    setActiveProject(project);

    newProject.users.forEach(async (user) => {
      user.projects = [...user.projects, project._id!];
      const res = await editUser(user);
    });

    toast({
      title: "Successfully created project",
      status: "success",
      position: "top-right",
      duration: 3000,
    });

    navigate("/project_overview");
  };

  useEffect(() => {
    setAvailableUsers(filterUsers(true));
  }, [newProject.projectLead, newProject.users]);

  return (
    <form className=" w-screen h-screen" onSubmit={handleCreateProject}>
      <Flex
        margin={8}
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
              w={"50%"}
              isRequired={true}
              placeholder="Project Name"
            />
          </InputGroup>
        </ProjectField>

        <ProjectField fieldName="Project Description">
          <InputGroup>
            <Textarea
              onChange={handleChange}
              name="description"
              w={"50%"}
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
          <UserSelectMenu
            onSelect={(user: IUser) => {
              setNewProject({
                ...newProject,
                users: [...newProject.users, user],
              });
              toast({
                title: `Added ${user.email} to project`,
                duration: 3000,
                status: "success",
                position: "top-right",
              });
            }}
            defaultValue={"Select User"}
            users={availableUsers}
          />
        </ProjectField>
        <ProjectField fieldName="Project Lead">
          <UserSelectMenu
            users={newProject.users}
            onSelect={(value: IUser) => {
              setNewProject({
                ...newProject,
                projectLead: value,
              });
            }}
            defaultValue={newProject.projectLead.name}
          />
        </ProjectField>
        <Button colorScheme="purple" type="submit">
          Create
        </Button>
      </Flex>
    </form>
  );
};
