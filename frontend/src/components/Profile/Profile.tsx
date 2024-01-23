import { FC } from "react";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { IUser } from "../../interfaces";

interface ProfileProps {
  user?: IUser;
  width?: string;
  height?: string;
  onClick?: (name: string) => void;
}

export const Profile: FC<ProfileProps> = ({ onClick, width, height, user }) => {
  const shortName = user?.name.substring(0, 2).toUpperCase();

  const handleClick = () => {
    if (onClick) onClick(user?.name || "");
  };

  return (
    <Avatar
      onClick={handleClick}
      src={user?.picture}
      className={`rounded-full  ${width ? width : "w-10"} ${
        height ? height : "h-10"
      } cursor-pointer hover:scale-105 font-bold text-center flex justify-center items-center  `}
    ></Avatar>
  );
};
