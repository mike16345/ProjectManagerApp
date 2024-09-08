import React, { useState } from "react";

import GoogleLogin from "@/components/Pages/LoginPage/GoogleLogin";
import { Else, If, Then } from "react-if";
import { IGoogleUser, IUser } from "@/interfaces";
import useAuth from "@/Authentication/useAuth";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
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
import { getImage, getImageNames } from "@/utils/utils";
import { userRequests } from "@/requests/UserRequests";

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
    const imageNames = getImageNames();
    const randIndex = Math.floor(Math.random() * imageNames.length);
    const picture = getImage(imageNames[randIndex]);

    const newUser: IUser = { ...userDetails, picture: picture, type: "local" };
    const res = await userRequests.registerHandler(newUser);

    if (!res.token) {
      toast({
        title: res as string,
        description: "Email is already in use!",
        variant: "destructive",
      });
      return;
    }

    const user = await userRequests.verifyToken(res.token);
    setActiveUser(user);

    toast({
      title: "Account Created!",
      variant: "success",
      description: "Successfully created your account.",
      duration: 2000,
    });
    secureLocalStorage.clear();
    secureLocalStorage.setItem("user-token", res.token);

    setTimeout(() => {
      login();
    }, 500);
  };

  return (
    <div className=" flex flex-col justify-center items-center  overflow-hidden w-full h-full">
      <div className=" bg-secondary  lg:max-w-xl">
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className="space-y- p-2">
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
                      <FormLabel htmlFor="Name">Name</FormLabel>
                      <FormControl>
                        <Input
                          id="Name"
                          type="name"
                          className="  w-[90%] focus-visible:ring-0 focus-visible:border-primary"
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
                      <FormLabel htmlFor="Email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="Email"
                          type="email"
                          className="  w-[90%] focus-visible:ring-0 focus-visible:border-primary"
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
                      <FormLabel htmlFor="Password">Password</FormLabel>
                      <FormControl>
                        <div className=" flex  items-center">
                          <Input
                            id="Password"
                            type={showPassword ? "text" : "password"}
                            className="  w-full focus-visible:ring-0 focus-visible:border-primary"
                            placeholder="Password"
                            {...field}
                          />
                          <If condition={!showPassword}>
                            <Then>
                              <EyeIcon
                                onClick={() => setShowPassword(true)}
                                className=" ml-2 cursor-pointer"
                              />
                            </Then>
                            <Else>
                              <EyeOffIcon
                                onClick={() => setShowPassword(false)}
                                className=" ml-2 cursor-pointer"
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
                          className="   w-[90%] focus-visible:ring-0 focus-visible:border-primary"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                  <GoogleLogin onSuccessHandler={onGoogleLoginSuccess} />
                </div>
                <Separator className="mt-2 " />
                <span className=" text-xs text-center text-primary">
                  Already have an account?{" "}
                  <span
                    onClick={setRegister}
                    className=" text-blue-600 cursor-pointer text-sm hover:underline"
                  >
                    Login
                  </span>
                </span>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
