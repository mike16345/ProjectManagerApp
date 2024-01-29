import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { IGoogleUser } from "../../../interfaces";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface IGoogleLogin {
  onSuccessHandler: (user: IGoogleUser) => void;
}

const GoogleLogin: React.FC<IGoogleLogin> = ({ onSuccessHandler }) => {
  const [user, setUser] = useState<TokenResponse | null>(null);
  const { toast } = useToast();
  const login = useGoogleLogin({
    onSuccess: (codeResponse: TokenResponse) => {
      setUser(codeResponse);
      toast({
        title: "Login Successful",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: "Failed to login. Check credentials.",
        variant: "destructive",
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
    <div className="w-full">
      <Button
        type="button"
        className=" flex justify-center bg-primary  text-secondary font-semibold items-center w-full  "
        onClick={() => login()}
      >
        <FcGoogle className="mr-4" />
        Sign in with Google
      </Button>
    </div>
  );
};

export default GoogleLogin;
