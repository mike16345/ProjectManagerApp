import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { IGoogleUser, IUser } from "../../../interfaces";
import { useToast } from "@chakra-ui/react";

interface IGoogleLogin {
  onSuccessHandler: (user: IGoogleUser) => void;
}
const GoogleLogin: React.FC<IGoogleLogin> = ({ onSuccessHandler }) => {
  const [user, setUser] = useState<TokenResponse | null>(null);
  const toast = useToast();
  const login = useGoogleLogin({
    onSuccess: (codeResponse: TokenResponse) => {
      setUser(codeResponse);
      toast({
        title: "Login Successful",
        description: "Login Successful",
        position:"top-right",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: "Failed to login. Check credentials.",
        status: "error",
      });
    },
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          onSuccessHandler(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="">
      <button
        type="button"
        className=" flex justify-center items-center w-full border-2 border-black  p-3 rounded-lg cursor-pointer outline-none"
        onClick={() => login()}
      >
        <FcGoogle className="mr-4" />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
