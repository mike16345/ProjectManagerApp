import React, { useState } from "react";

import GoogleLogin from "../Pages/LoginPage/GoogleLogin";
import { Else, If, Then } from "react-if";
import useAuth from "@/Authentication/useAuth";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { useUsersStore } from "@/store/usersStore";
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
import { IGoogleUser } from "@/interfaces";
import { useToast } from "../ui/use-toast";
import { userRequests } from "@/requests/UserRequests";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, { message: "Please enter a valid password." }),
});

interface ILoginForm {
  onGoogleLoginSuccess: (user: IGoogleUser) => void;
  setRegister: () => void;
}

const LoginForm: React.FC<ILoginForm> = ({
  onGoogleLoginSuccess,
  setRegister,
}) => {
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    onLoginHandler(values);
  }

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setActiveUser } = useUsersStore();

  const [showPassword, setShowPassword] = useState(false);

  const onLoginHandler = async (userDetails: any) => {
    try {
      const { user, token } = await userRequests.loginHandler(userDetails);

      if (token) {
        secureLocalStorage.clear();
        secureLocalStorage.setItem("user-token", token);

        await userRequests.verifyToken(token);
        setActiveUser(user);

        toast({
          title: "Successfully logged in",
          variant: "success",
          duration: 2000,
        });

        setTimeout(() => {
          login();
        }, 500);
      } else {
        toast({
          title: "Login Failed",
          description: "Incorrect Username or Password",
          duration: 1500,
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Try again later.",
        variant: "destructive",
        duration: 2000,
      });
      console.log(error);
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className=" bg-secondary lg:max-w-lg">
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Sign in</CardTitle>
                <CardDescription className="text-center">
                  Enter your email and password to login
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className=" w-[25vw] focus-visible:ring-0 focus-visible:border-primary"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className=" flex justify-between items-center">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="  w-[25vw] focus-visible:ring-0 focus-visible:border-primary"
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
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <span className="mt-2 text-xs text-center text-primary">
                  Don't have an account?{" "}
                  <span
                    onClick={setRegister}
                    className=" text-blue-500 cursor-pointer text-sm hover:underline"
                  >
                    Register
                  </span>
                </span>
                <Separator />
                <GoogleLogin onSuccessHandler={onGoogleLoginSuccess} />
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
