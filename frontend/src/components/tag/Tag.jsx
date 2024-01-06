import classes from "./Tag.module.css";

// gets props from testModal
const Tag = (props) => {
  return (
    <p
      className={`${classes[`priority-${props.children}`]}    ${
        props.isMyTasks && classes.status
      }`}
    >
      {props.children}
    </p>
  );
};

export default Tag;
