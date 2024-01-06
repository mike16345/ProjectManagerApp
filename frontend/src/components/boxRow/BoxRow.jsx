import { Fragment } from "react";
import classes from "./BoxRow.module.css";

const BoxRow = (props) => {
  return (
    <Fragment>
      <div className={classes.container}>{props.children}</div>
    </Fragment>
  );
};

export default BoxRow;
