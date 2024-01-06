import Button from "../../../button/Button";
import classes from "./InputForm.module.css";
import InputWrap from "./InputWrap";
import { useState } from "react";

// gets props from login page
const InputForm = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");

  const userNameChangeHandler = (event) => {
    setUserName(event.target.value);
  };
  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };
  const confirmChangeHandler = (event) => {
    setConfirm(event.target.value);
  };

  const validateConfirmPassword = () => {
    // add if not the same show some feedback
    if (!confirm) return true;
    return confirm === password;
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!validateConfirmPassword()) {
      console.log("not the same");
      return;
    }
    const loginData = {
      email: email,
      name: userName ? userName : "",
      password: password,
    };
    props.onLogin(loginData);
  };

  return (
    <InputWrap>
      <form onSubmit={onSubmitHandler} className={classes.form}>
        <div className={classes.inputForm}>
          {props.register && (
            <div className={classes.item}>
              <label htmlFor="fullname" className={classes.label}>
                Full name
                <input
                  type="text"
                  name="fullName"
                  required
                  onChange={userNameChangeHandler}
                />
              </label>
            </div>
          )}
          <div className={classes.item}>
            <label className={classes.label}>
              E-mail
              <input
                type="email"
                name="email"
                required
                onChange={emailChangeHandler}
              />
            </label>
          </div>
          <div className={classes.item}>
            <label className={classes.label}>
              Password
              <input
                type="password"
                name="password"
                required
                onChange={passwordChangeHandler}
              />
            </label>
          </div>
          {props.register && (
            <div className={classes.item}>
              <label className={classes.label}>
                Confirm Password
                <input
                  type="password"
                  name="confirm"
                  required
                  onChange={confirmChangeHandler}
                />
              </label>
            </div>
          )}
        </div>
        <div className={classes.btn}>
          <Button type="submit">{props.actionName}</Button>
        </div>
      </form>
    </InputWrap>
  );
};

export default InputForm;
