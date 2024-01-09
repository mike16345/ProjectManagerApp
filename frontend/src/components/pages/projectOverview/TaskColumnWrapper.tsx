import React, { Fragment } from "react";
import TaskColumn from "./TaskColumn";

interface TaskColumnWrapperProps {
  onUpdate: (id: string, status: string) => void;
  openCreateIssueModal: () => void;
  tasks: {
    todo: any[];
    inProgress: any[];
    codeReview: any[];
    done: any[];
  };
}

const TaskColumnWrapper: React.FC<TaskColumnWrapperProps> = (props) => {
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
