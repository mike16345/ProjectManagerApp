import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { User } from "../../../interfaces";
import { useUsersStore } from "../../../store/usersStore";

interface IGoogleLogin {
  onSuccessHandler: (user: User) => void;
}
const GoogleLogin = () => {
  const [user, setUser] = useState<TokenResponse | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const { activeUser, setActiveUser } = useUsersStore();

  const login = useGoogleLogin({
    onSuccess: (codeResponse: TokenResponse) => {
      console.log("code response:", codeResponse);

      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
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
          setProfile(res.data);
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
