import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  loginHandler,
  registerHandler,
  signInWithGoogle,
  verifyToken,
} from "../../../API/UserAPIcalls";

import GoogleLogin from "./GoogleLogin";
import { Else, If, Then, When } from "react-if";
import { IGoogleUser } from "../../../interfaces";
import useAuth from "@/Authentication/useAuth";
import secureLocalStorage from "react-secure-storage";
import { Link, useNavigate } from "react-router-dom";
import { useUsersStore } from "@/store/usersStore";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon, LockIcon, Mail, User2Icon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@chakra-ui/react";
import { Separator } from "@/components/ui/separator";
import LoginForm from "@/components/Forms/LoginForm";
import RegisterForm from "@/components/Forms/RegisterForm";

interface RegisterFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  type: string;
}

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, { message: "Please enter a valid password." }),
});

const registerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(25, { message: "Name cannot be more than 25 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, { message: "Please enter a valid password." }),
  confirmPassword: z
    .string()
    .min(4, { message: "Please enter a valid password." }),
});

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

    const response = await registerHandler(googleUser);
    if (response.token) {
      const user = await verifyToken(response.token);
      setActiveUser(user.data);

      secureLocalStorage.clear();
      secureLocalStorage.setItem("user-token", response.token);
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
