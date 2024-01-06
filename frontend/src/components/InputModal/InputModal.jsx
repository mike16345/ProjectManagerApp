import { useContext, useState } from "react";
import Modal from "../modal/Modal";
import Tag from "../tag/Tag";
import Button from "../button/Button";
import classes from "./InputModal.module.css";
import AppContext from "../../context/Context";

// gets props from project overview
const InputModal = (props) => {
  const context = useContext(AppContext);
  const currentProject = context.currentProject;

  const emails = props.usersList;
  const priorities = ["none", "epic", "high", "low"];

  let description = null;
  let assignee = null;
  let priority = null;

  if (props.isEditMode) {
    description = props.descValue;
    assignee = props.userSelected;
    priority = props.prioritySelected;
  } else {
    description = "";
    // should be changed later
    assignee = "none@gmail.com";
    priority = priorities[0];
  }

  const [descriptionState, setDescriptionState] = useState(description);
  const [assigneeState, setAssigneeState] = useState(assignee);
  const [priorityState, setPriorityState] = useState(priority);
  const [statusState, setStatusState] = useState(props.status);

  const onChangeDescHandler = (event) => {
    setDescriptionState(event.target.value);
  };

  const onSelectEmailHandler = (event) => {
    // fix the problem of getting null and cannot send cuz it is not an email
    const value = event.target.value;
    if (value === "none") setAssigneeState("none@gmail.com");
    else setAssigneeState(event.target.value);
  };
  const onSelectPriorityHandler = (event) => {
    setPriorityState(event.target.value);
  };
  const onSelectStatusHandler = (event) => {
    const statusSelected = event.target.value;
    setStatusState(statusSelected);
    if (props.status === "to do") {
      setAssigneeState(context.userLogged.email);
    }
  };

  const onSubmitingForm = (e) => {
    e.preventDefault();
    const task = {
      text: descriptionState,
      email: assigneeState,
      priority: priorityState,
      task_id: props.task_id,
      project_id: currentProject._id,
      status: !statusState ? "to do" : statusState,
    };
    props.onCreateIssue(task);
  };

  const onDeleteTask = () => {
    props.delete(props.task_id);
  };

  const statusSelect = props.isEditMode ? (
    <select
      defaultValue={statusState}
      onChange={onSelectStatusHandler}
      className={classes["drop-select-status"]}
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
        {/* ---------------------- */}
        <div className={classes.bottomHalf}>
          {/* <Tag>{props.task_id}</Tag> */}
          {statusSelect}
          <div className={classes["drop-select"]}>
            <label>Assign to: </label>
            <select
              defaultValue={props.userSelected}
              name="assignee"
              onChange={onSelectEmailHandler}
            >
              <option value="none">none</option>
              {emails.map((name, index) => {
                return (
                  <option key={index} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={classes["drop-select-priority"]}>
            <label>priority:</label>
            <select
              defaultValue={props.prioritySelected}
              name="priority"
              onChange={onSelectPriorityHandler}
            >
              {priorities.map((priority, index) => {
                return (
                  <option key={index} value={priority}>
                    {priority}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className={classes.btns}>
          <Button type="submit">{props.okBtn}</Button>
          {props.isEditMode ? (
            <Button onClick={onDeleteTask}>Delete</Button>
          ) : null}
          <Button type="button" onClick={props.onCloseModal}>
            Cancel
          </Button>
        </div>

        {/* ------------------------------- */}
      </form>
    </Modal>
  );
};

export default InputModal;
