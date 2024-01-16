import React, { useState } from "react";
import { createProject } from "../../../API/ProjectAPIcalls";
import { Project } from "../../../interfaces";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddProjectModal: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const onChangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const onCreateProjectHandler = async () => {
    const project = await createProject(projectName);
    setAllProjects([...allProjects, project]);
  };

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <VStack spacing={4} align="center">
      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={onCreateProjectHandler}
      >
        <FormControl id="projectName">
          <FormLabel>Project name:</FormLabel>
          <Input
            type="text"
            onChange={onChangeInputHandler}
            placeholder="Project Name"
          />
        </FormControl>

        <Flex flexDirection={"column"} gap={2}>
          <FormControl id="startDate" mr={4}>
            <FormLabel>Start Date:</FormLabel>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              withPortal
            />
          </FormControl>
        </Flex>
      </form>
    </VStack>
  );
};

export default AddProjectModal;
