import React, { useState, ChangeEvent, FormEvent } from "react";
import Button from "../../../button/Button";
import classes from "./InputForm.module.css";

interface InputFormProps {
  register?: boolean;
  onLogin: (loginData: {
    email: string;
    name: string;
    password: string;
  }) => void;
  actionName: string;
}

const InputForm: React.FC<InputFormProps> = (props: InputFormProps) => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const userNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const emailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const confirmChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirm(event.target.value);
  };

  const validateConfirmPassword = (): boolean => {
    if (!confirm) return true;
    return confirm === password;
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
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
    <div>
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
    </div>
  );
};

export default InputForm;
