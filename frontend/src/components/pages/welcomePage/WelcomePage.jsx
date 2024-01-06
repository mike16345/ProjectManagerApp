import { Fragment } from "react";
import classes from "./WelcomePage.module.css";

const WelcomePage = (props) => {
  const { name, isNew } = props;
  const greeting = isNew ? "aboard" : "back";
  return (
    <Fragment>
      <h2 className={classes.welcome}>
        Welcome {greeting} {name}
      </h2>
    </Fragment>
  );
};

export default WelcomePage;
