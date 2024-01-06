import classes from "./InputForm.module.css";

const InputWrap = (props) => {
  return <div className={classes.wrapBox}>{props.children}</div>;
};

export default InputWrap;
