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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { userRequests } from "@/requests/UserRequests";

const userFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, { message: "Please enter a valid password." }),
});

const UserSettings = () => {
  const activeUser = useUsersStore((state) => state.activeUser);
  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: activeUser?.email,
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof userFormSchema>) {
    console.log(values);
  }

  return (
    <div className=" flex flex-col gap-4 p-4  min-h-screen overflow-hidden">
      <div className="font-bold text-4xl">Settings</div>
      <div className=" lg:max-w-lg">
        <Form {...userForm}>
          <form
            className="flex flex-col justify-center gap-4 "
            onSubmit={userForm.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col justify-center gap-2">
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className=" w-[25vw] focus-visible:ring-0 focus-visible:border-primary"
                        placeholder={activeUser?.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-20">Confirm</Button>
            </div>
            <FormField
              control={userForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className=" w-[25vw] focus-visible:ring-0 focus-visible:border-primary"
                      placeholder={activeUser?.email}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserSettings;
