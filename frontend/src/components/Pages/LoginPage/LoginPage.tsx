import React, { useState } from "react";
import { Else, If, Then } from "react-if";
import { IGoogleUser } from "../../../interfaces";
import useAuth from "@/Authentication/useAuth";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { useUsersStore } from "@/store/usersStore";
import LoginForm from "@/components/Forms/LoginForm";
import RegisterForm from "@/components/Forms/RegisterForm";
import { userRequests } from "@/requests/UserRequests";

const LoginPage: React.FC = () => {
  const [register, setRegister] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { setActiveUser } = useUsersStore();

  const onGoogleLoginSuccess = async (user: IGoogleUser) => {
    const googleUser = {
      name: user.name || "",
      googleId: user.id || "",
      email: user.email || "",
      picture: user.picture,
      isVerified: user.verified_email,
      type: "googleUser",
    };

    const response = await userRequests.registerHandler(googleUser);

    if (response.token) {
      const user = await userRequests.verifyToken(response.token);

      secureLocalStorage.setItem("user-token", response.token);
      setActiveUser(user);
    }

    setTimeout(() => {
      login();
      navigate("/home");
    }, 500);
  };

  return (
    <>
      <If condition={!register}>
        <Then>
          <LoginForm
            onGoogleLoginSuccess={onGoogleLoginSuccess}
            setRegister={() => setRegister(true)}
          />
        </Then>
        <Else>
          <RegisterForm
            onGoogleLoginSuccess={onGoogleLoginSuccess}
            setRegister={() => setRegister(false)}
          />
        </Else>
      </If>
    </>
  );
};

export default LoginPage;
