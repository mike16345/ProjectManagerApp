import classes from "./Button.module.css";

const Button = (props) => {
  const margin = props.style;
  return (
    // onClick temp name
    <button
      type={props.type}
      className={`${classes.card} ${classes[margin]}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
