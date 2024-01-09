import React from "react";
import Task from "../../task/Task";

interface TaskColumnProps {
  header: string;
  tasks: any[]; // Update the type according to your task structure
  onUpdate: (id: string, status: string) => void;
  openCreateIssueModal: () => void;
}

const TaskColumn: React.FC<TaskColumnProps> = (props) => {
  const onTaskUpdateHandler = (id: string, status: string) => {
    props.onUpdate(id, status);
  };

  const createIssueHandler = () => {
    props.openCreateIssueModal();
  };

  return (
    <div className="column">
      <header className="header">
        {props.tasks.length > 0
          ? `${props.header} ${props.tasks.length} issues`
          : props.header}
        {props.header === "To do" && (
          <button className="addIssueBtn" onClick={createIssueHandler}>
            +
          </button>
        )}
      </header>
      <div className="column-body">
        {props.tasks.map((task, index) => (
          <Task
            onUpdate={onTaskUpdateHandler}
            key={index}
            taskText={task.text}
            taskNumber={task.task_id}
            priority={task.priority}
            db_id={task._id}
            assignee={task.email}
            status={task.status}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
