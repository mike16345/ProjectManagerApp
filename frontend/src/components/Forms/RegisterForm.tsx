import React, { useState } from "react";
import { registerHandler, verifyToken } from "@/API/UserAPIcalls";

import GoogleLogin from "@/components/Pages/LoginPage/GoogleLogin";
import { Else, If, Then } from "react-if";
import { IGoogleUser } from "@/interfaces";
import useAuth from "@/Authentication/useAuth";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "../ui/use-toast";
import { useUsersStore } from "@/store/usersStore";

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

interface IRegisterForm {
  onGoogleLoginSuccess: (user: IGoogleUser) => void;
  setRegister: () => void;
}

const RegisterForm: React.FC<IRegisterForm> = ({
  onGoogleLoginSuccess,
  setRegister,
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setActiveUser } = useUsersStore();
  const [showPassword, setShowPassword] = useState(false);

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    if (values.password !== values.confirmPassword) {
      registerForm.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
      return;
    }
    onRegisterHandler(values);
  }

  const onRegisterHandler = async (userDetails: any) => {
    const newUser = { ...userDetails, type: "local" };
    const { token } = await registerHandler(newUser);

    if (!token) return;
    const user = await verifyToken(token);
    setActiveUser(user.data);

    toast({
      title: "Account Created!",
      variant: "success",
      description: "Successfully created your account.",
      duration: 2000,
    });
    secureLocalStorage.clear();
    secureLocalStorage.setItem("user-token", token);

    setTimeout(() => {
      login();
      navigate("/myTasks");
    }, 500);
  };

  return (
    <div className="  flex flex-col justify-center items-center mt-12 mb-12">
      <div className=" bg-secondary  lg:max-w-lg">
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className="space-y-1 p-2">
                <CardTitle className="text-2xl text-center">Register</CardTitle>
                <CardDescription className="text-center">
                  Fill in your information to create an account.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="name"
                          className=" w-[77vh] focus-visible:ring-0 focus-visible:border-black"
                          placeholder="Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className=" w-[77vh] focus-visible:ring-0 focus-visible:border-black"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className=" flex justify-between items-center">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="  w-[77vh] focus-visible:ring-0 focus-visible:border-black"
                            placeholder="Password"
                            {...field}
                          />
                          <If condition={!showPassword}>
                            <Then>
                              <EyeIcon
                                onClick={() => setShowPassword(true)}
                                className="ml-2 cursor-pointer"
                              />
                            </Then>
                            <Else>
                              <EyeOffIcon
                                onClick={() => setShowPassword(false)}
                                className="ml-2 cursor-pointer"
                              />
                            </Else>
                          </If>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="  w-[77vh] focus-visible:ring-0 focus-visible:border-black"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button type="submit" className="w-full">
                  Register
                </Button>
                <span className="mt-2 text-xs text-center text-gray-700">
                  Already have an account?{" "}
                  <span
                    onClick={setRegister}
                    className=" text-blue-600 hover:underline"
                  >
                    Login
                  </span>
                </span>
                <Separator className="mb-2 " />
                <GoogleLogin onSuccessHandler={onGoogleLoginSuccess} />
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
