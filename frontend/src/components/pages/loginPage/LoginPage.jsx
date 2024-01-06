import Card from "../../card/Card";
import InputForm from "./inputForm/InputForm";
import classes from "./inputForm/InputForm.module.css";
import Swal from "sweetalert2";

import {
  loginHandler,
  registerHandler,
  signInWithGoogle,
} from "../../../API/UserAPIcalls";
import { useState } from "react";

import { GoogleLogin } from "react-google-login";

import ErrorModal from "../../errorModal/ErrorModal";

let errorMsg = "";
// gets props from app
const LoginPage = (props) => {
  const onRegisterHandler = async (user) => {
    user.type = "local";
    const response = await registerHandler(user);
    localStorage.setItem("token-promger", response.token);
    props.loginOnToken(response.isNew);
  };

  const onLoginHandler = async (userDetails) => {
    const response = await loginHandler(userDetails);
    const data = response.data.data;
    if (response.data.status === "ok") {
      localStorage.setItem("token-promger", data);
      props.loginOnToken(response.isNew);
    } else if (response.data.status === "error") {
      Swal.fire({
        icon: "error",
        text: data,
        timer: 900,
      });
    }
  };

  const clientId = process.env.REACT_APP_CLIENT_ID;

  const onSuccess = async (res) => {
    const user = {
      name: res.profileObj.name,
      googleId: res.profileObj.googleId,
      email: res.profileObj.email,
      type: "other",
    };

    const response = await registerHandler(user);

    if (response.status === "registered") {
      localStorage.setItem("token-promger", response.token);
      props.loginOnToken(response.isNew);
    } else if (response.response.status === 401) {
      localStorage.setItem("token-promger", response.response.data.token);
      props.loginOnToken(response.response.isNew);
    }
  };

  const onFailure = (err) => {
    console.log("failed:", err);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Sign in with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={false}
      />
      <div className={classes.page}>
        <Card>
          <InputForm
            onLogin={onRegisterHandler}
            register={true}
            actionName="Register"
          />
        </Card>
        <div className={classes.divider}></div>
        <Card>
          <InputForm onLogin={onLoginHandler} actionName="Log-in" />
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
