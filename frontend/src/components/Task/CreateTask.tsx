import React, { useState } from "react";
import Modal from "../Modal/Modal";
import Tag from "../Tag/Tag";
import Button from "../Button/Button";
import classes from "./InputModal.module.css";
import { TaskStatus } from "../../enums/TaskStatus";
import { useProjectsStore } from "../../store/projectsStore";
import { useUsersStore } from "../../store/usersStore";
import { ITask } from "../../interfaces";
import { Priority } from "../../enums/Priority";
import { When } from "react-if";

interface InputModalProps {
  onCloseModal: () => void;
  taskToEdit?: ITask | null;
  usersList: string[];
  confirmButtonText: string;
  onCreateTask: (task: ITask) => void;
  handleDeleteTask: (taskId: number) => void;
}

const CreateTask: React.FC<InputModalProps> = ({
  onCloseModal,
  onCreateTask,
  handleDeleteTask,
  usersList,
  taskToEdit,
  confirmButtonText,
}) => {
  const { activeProject } = useProjectsStore();
  const { activeUser } = useUsersStore();
  const DEFAULT_EMAIL = "none@gmail.com";

  const [descriptionState, setDescriptionState] = useState<string>(
    taskToEdit?.text || ""
  );
  const [assignee, setAssignee] = useState<string>(
    taskToEdit?.email || DEFAULT_EMAIL
  );

  const [selectedPriority, setSelectedPriority] = useState<Priority>(
    taskToEdit?.priority || Priority.NONE
  );
  const [statusState, setStatusState] = useState<TaskStatus>(
    taskToEdit?.status || TaskStatus.TODO
  );

  const onChangeDescHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionState(event.target.value);
  };

  const onSelectEmailHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAssignee(value === "none" ? DEFAULT_EMAIL : value);
  };

  const onSelectPriorityHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPriority(e.target.value);
  };

  const onSelectStatusHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const statusSelected = e.target.value;
    setStatusState(statusSelected);
    if (taskToEdit?.status === TaskStatus.TODO) {
      setAssignee(activeUser!.email);
    }
  };

  const onSubmitingForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const task = {
      text: descriptionState,
      email: assignee,
      priority: selectedPriority,
      task_id: taskToEdit?.task_id || Date.now().valueOf(),
      project_id: activeProject?._id || "",
      status: !statusState ? TaskStatus.TODO : statusState,
    };
    onCreateTask(task);
  };

  const onDeleteTask = () => {
    if (!taskToEdit) return;
    handleDeleteTask(taskToEdit?.task_id);
  };

  const statusSelect = taskToEdit ? (
    <select
      defaultValue={statusState}
      onChange={onSelectStatusHandler}
      className="drop-select-status"
    >
      <option value={TaskStatus.TODO}>{TaskStatus.TODO}</option>
      <option value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</option>
      <option value={TaskStatus.CODE_REVIEW}>{TaskStatus.CODE_REVIEW}</option>
      <option value={TaskStatus.DONE}>{TaskStatus.DONE}</option>
    </select>
  ) : null;

  return (
    <Modal onClose={onCloseModal}>
      <form onSubmit={onSubmitingForm} className={classes.form}>
        <div className={classes["input-box"]}>
          <label>Description</label>
          <input
            type="text"
            value={descriptionState}
            placeholder={
              descriptionState.length === 0 ? "Write a task" : descriptionState
            }
            onChange={onChangeDescHandler}
          />
        </div>
        <div className={classes.bottomHalf}>
          {statusSelect}
          <div className="drop-select">
            <label>Assign to: </label>
            <select
              className=" border w-32"
              defaultValue={taskToEdit?.email}
              name="assignee"
              onChange={onSelectEmailHandler}
            >
              <option value="none">none</option>
              {usersList.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="drop-select-priority">
            <label>Priority:</label>
            <select
              defaultValue={selectedPriority}
              name="Priority"
              onChange={onSelectPriorityHandler}
            >
              {Object.values(Priority).map((priority, index) => (
                <option key={index} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="btns">
          <Button type="submit">{confirmButtonText}</Button>
          <When condition={taskToEdit != null}>
            <Button onClick={onDeleteTask}>Delete</Button>
          </When>
          <Button onClick={onCloseModal}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTask;
