import React, { useContext, useState } from "react";
import Modal from "../modal/Modal";
import Tag from "../tag/Tag";
import Button from "../button/Button";
import classes from "./InputModal.module.css";
import AppContext from "../../context/Context";

interface InputModalProps {
  onCloseModal: () => void;
  usersList: string[];
  isEditMode: boolean;
  descValue?: string;
  userSelected?: string;
  prioritySelected?: string;
  status?: string;
  task_id?: string;
  onCreateIssue: (task: {
    text: string;
    email: string;
    priority: string;
    task_id?: string;
    project_id: string;
    status: string;
  }) => void;
  delete: (taskId: string) => void;
  okBtn: string;
}

const InputModal: React.FC<InputModalProps> = (props: InputModalProps) => {
  const context = useContext(AppContext);
  const currentProject = context.currentProject;

  const emails = props.usersList;
  const priorities = ["none", "epic", "high", "low"];

  let description = "";
  let assignee = "none@gmail.com";
  let priority = priorities[0];

  if (props.isEditMode) {
    description = props.descValue || "";
    assignee = props.userSelected || "none@gmail.com";
    priority = props.prioritySelected || priorities[0];
  }

  const [descriptionState, setDescriptionState] = useState<string>(description);
  const [assigneeState, setAssigneeState] = useState<string>(assignee);
  const [priorityState, setPriorityState] = useState<string>(priority);
  const [statusState, setStatusState] = useState<string | undefined>(
    props.status
  );

  const onChangeDescHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionState(event.target.value);
  };

  const onSelectEmailHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setAssigneeState(value === "none" ? "none@gmail.com" : value);
  };

  const onSelectPriorityHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriorityState(event.target.value);
  };

  const onSelectStatusHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const statusSelected = event.target.value;
    setStatusState(statusSelected);
    if (props.status === "to do") {
      setAssigneeState(context.userLogged.email);
    }
  };

  const onSubmitingForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const task = {
      text: descriptionState,
      email: assigneeState,
      priority: priorityState,
      task_id: props.task_id || "",
      project_id: currentProject._id,
      status: !statusState ? "to do" : statusState,
    };
    props.onCreateIssue(task);
  };

  const onDeleteTask = () => {
    props.delete(props.task_id || "");
  };

  const statusSelect = props.isEditMode ? (
    <select
      defaultValue={statusState}
      onChange={onSelectStatusHandler}
      className="drop-select-status"
    >
      <option value="to do">to do</option>
      <option value="in progress">in progress</option>
      <option value="code review">code review</option>
      <option value="done">done</option>
    </select>
  ) : null;

  return (
    <Modal onClose={props.onCloseModal}>
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
              defaultValue={props.userSelected}
              name="assignee"
              onChange={onSelectEmailHandler}
            >
              <option value="none">none</option>
              {emails.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="drop-select-priority">
            <label>priority:</label>
            <select
              defaultValue={props.prioritySelected}
              name="priority"
              onChange={onSelectPriorityHandler}
            >
              {priorities.map((priority, index) => (
                <option key={index} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="btns">
          <Button type="submit">{props.okBtn}</Button>
          {props.isEditMode ? (
            <Button type="button" onClick={onDeleteTask}>
              Delete
            </Button>
          ) : null}
          <Button type="button" onClick={props.onCloseModal}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InputModal;
