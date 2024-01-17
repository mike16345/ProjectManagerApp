import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { IGoogleUser, IUser } from "../../../interfaces";

interface IGoogleLogin {
  onSuccessHandler: (user: IGoogleUser) => void;
}
const GoogleLogin: React.FC<IGoogleLogin> = ({ onSuccessHandler }) => {
  const [user, setUser] = useState<TokenResponse | null>(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse: TokenResponse) => {
      console.log("code response:", codeResponse);
      setUser(codeResponse);

      // Successful login alert
    },
    onError: (error) => {
      //TODO: Add Login error alert
      console.log("Login Failed:", error);
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
