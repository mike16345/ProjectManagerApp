import React, { useState } from "react";
import Card from "../../card/Card";
import InputForm from "./inputForm/InputForm";
import Swal from "sweetalert2";
import {
  loginHandler,
  registerHandler,
  signInWithGoogle,
} from "../../../API/UserAPIcalls";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  chakra,
} from "@chakra-ui/react";

import { FaUserAlt, FaLock } from "react-icons/fa";

import GoogleLogin from "./GoogleLogin";

interface LoginPageProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  loginOnToken: (isNew: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ loginOnToken, isLoggedIn }) => {
  const onRegisterHandler = async (user: any) => {
    user.type = "local";
    const response = await registerHandler(user);
    if (!response.token) return;
    localStorage.setItem("token-promger", response.token);
    loginOnToken(response.isNew);
  };

  const onLoginHandler = async (userDetails: any) => {
    const response = await loginHandler(userDetails);
    const data = response.data.data;
    if (response.data.status === "ok") {
      localStorage.setItem("token-promger", data);
      loginOnToken(response.isNew);
    } else if (response.data.status === "error") {
      Swal.fire({
        icon: "error",
        text: data,
        timer: 900,
      });
    }
  };

  const clientId = "";
  const CFaUserAlt = chakra(FaUserAlt);
  const CFaLock = chakra(FaLock);

  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);
  // const onSuccess = async (
  //   res: GoogleLoginResponse | GoogleLoginResponseOffline
  // ) => {
  //   const user = {
  //     name: res.profileObj?.name || "",
  //     googleId: res.profileObj?.googleId || "",
  //     email: res.profileObj?.email || "",
  //     type: "other",
  //   };

  //   const response = await registerHandler(user);

  //   if (response.status === "registered") {
  //     localStorage.setItem("token-promger", response.token);
  //     loginOnToken(response.isNew);
  //   } else if (response?.status === "401") {
  //     localStorage.setItem("token-promger", response.data.token);
  //     loginOnToken(response.response.isNew);
  //   }
  // };

  // const onFailure = (err: any) => {
  //   console.log("failed:", err);
  // };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="email" placeholder="email address" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
              <GoogleLogin />
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color="teal.500" href="#">
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};
{
  /* <div className="page">
        <Card>
          <InputForm
            onLogin={onRegisterHandler}
            register={true}
            actionName="Register"
          />
        </Card>
        <div className="divider"></div>
        <Card>
          <InputForm onLogin={onLoginHandler} actionName="Log-in" />
        </Card>
      </div> */
}
export default LoginPage;
