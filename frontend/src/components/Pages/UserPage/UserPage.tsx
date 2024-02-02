import React, { useState } from "react";
import { Else, If, Then } from "react-if";
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
import { useToast } from "@/components/ui/use-toast";
import { userRequests } from "@/requests/UserRequests";

const userFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, { message: "Please enter a valid password." }),
});

const UserSettings = () => {
  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof userFormSchema>) {
    console.log(values);
  }

  return (
    <div>
      <div className=" flex flex-col justify-center items-center min-h-screen overflow-hidden">
        <div className=" bg-secondary lg:max-w-lg">
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">
                    Sign in
                  </CardTitle>
                  <CardDescription className="text-center">
                    Enter your email and password to login
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <FormField
                    control={userForm.control}
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
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>

                  <Separator />
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
