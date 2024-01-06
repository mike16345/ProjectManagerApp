import { Fragment } from "react";
import TaskColumn from "./TaskCoulmn";

const TaskColumnWrapper = (props) => {
  return (
    <Fragment>
      <TaskColumn
        onUpdate={props.onUpdate}
        openCreateIssueModal={props.openCreateIssueModal}
        tasks={props.tasks.todo}
        header="To do"
      />

      <TaskColumn
        onUpdate={props.onUpdate}
        openCreateIssueModal={props.openCreateIssueModal}
        tasks={props.tasks.inProgress}
        header="In progress"
      />
      <TaskColumn
        onUpdate={props.onUpdate}
        openCreateIssueModal={props.openCreateIssueModal}
        tasks={props.tasks.codeReview}
        header="Code review"
      />
      <TaskColumn
        onUpdate={props.onUpdate}
        openCreateIssueModal={props.openCreateIssueModal}
        tasks={props.tasks.done}
        header="Done"
      />
    </Fragment>
  );
};

export default TaskColumnWrapper;
