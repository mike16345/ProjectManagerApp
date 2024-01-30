import React, { useState } from "react";
import { registerHandler, verifyToken } from "../../../API/UserAPIcalls";

import { Else, If, Then } from "react-if";
import { IGoogleUser } from "../../../interfaces";
import useAuth from "@/Authentication/useAuth";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { useUsersStore } from "@/store/usersStore";
import LoginForm from "@/components/Forms/LoginForm";
import RegisterForm from "@/components/Forms/RegisterForm";
import { BY_EMAIL_ENDPOINT, userRequests } from "@/requests/UserRequests";

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

    try {
      const user = await userRequests.getItemByRequest(
        googleUser.email,
        BY_EMAIL_ENDPOINT
      );
      setActiveUser(user);

      setTimeout(() => {
        login();
        navigate("/myTasks");
      }, 500);
    } catch (error) {
      const response = await registerHandler(googleUser);
      if (response.token) {
        const user = await verifyToken(response.token);

        secureLocalStorage.clear();
        secureLocalStorage.setItem("user-token", response.token);
        setActiveUser(user.data);
      }

      if (
        response.status === "registered" ||
        response.status === "existing_user"
      ) {
        setTimeout(() => {
          login();
          navigate("/myTasks");
        }, 500);
      }
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default LoginPage;
