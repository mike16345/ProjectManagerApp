import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
  InputRightElement,
  chakra,
} from "@chakra-ui/react";

import { FaUserAlt, FaLock } from "react-icons/fa";

import GoogleLogin from "./GoogleLogin";
import { When } from "react-if";
import { IGoogleUser } from "../../../interfaces";

interface LoginPageProps {
  loginOnToken: (isNew: boolean) => void;
}

interface Input {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  type: string;
}
const LoginPage: React.FC<LoginPageProps> = ({ loginOnToken }) => {
  const CFaUserAlt = chakra(FaUserAlt);
  const CFaLock = chakra(FaLock);

  const [registerInput, setRegisterInput] = useState<Input>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [register, setRegister] = useState(false);

  const onRegisterHandler = async (user: Input) => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterInput({ ...registerInput, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (register) {
      if (!validateConfirmPassword()) {
        // Alert passwords dont match
        console.log("not the same");
      } else {
        onRegisterHandler(registerInput);
      }
    } else {
      onLoginHandler(registerInput);
    }
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  const validateConfirmPassword = (): boolean => {
    return registerInput.password === registerInput.confirmPassword;
  };

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
    if (response.token) localStorage.setItem("token-promger", response.token);

    if (
      response.status === "registered" ||
      response.status === "existing_user"
    ) {
      loginOnToken(response.isNew);
    }
  };

  useEffect(() => {
    setRegisterInput({
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    } as Input);
  }, [register]);

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.300"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="purple.500" />
        <Heading color="purple.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <When condition={register}>
                <FormControl isRequired={true}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      name="username"
                      value={registerInput.username}
                      onChange={handleChange}
                      type="text"
                      placeholder="Username"
                    />
                  </InputGroup>
                </FormControl>
              </When>
              <FormControl isRequired={true}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    name="email"
                    value={registerInput.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email Address"
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired={true}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    name="password"
                    value={registerInput.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <When condition={register}>
                <FormControl isRequired={true}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      value={registerInput.confirmPassword}
                      name="confirmPassword"
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </When>
              <Button
                onClick={handleSubmit}
                borderRadius={5}
                type="submit"
                variant="solid"
                colorScheme="purple"
                width="full"
              >
                {register ? "Register" : "Login"}
              </Button>
              <GoogleLogin onSuccessHandler={onGoogleLoginSuccess} />
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box className="flex gap-2">
        <p className="font-medium">New to us?</p>
        <Link
          color="purple.500"
          onClick={() => setRegister((register) => !register)}
        >
          {!register ? "Register" : "Login"}
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
