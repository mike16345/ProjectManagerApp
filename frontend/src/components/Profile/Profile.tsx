import { FC } from "react";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { IUser } from "../../interfaces";

interface ProfileProps {
  user?: IUser;
  width?: number;
  height?: number;
  onClick?: (name: string) => void;
}

export const Profile: FC<ProfileProps> = ({ onClick, width, height, user }) => {
  const handleClick = () => {
    if (onClick) onClick(user?.name || "");
  };

  return (
    <Avatar
      onClick={handleClick}
      src={user?.picture}
      width={width ? width : 10}
      height={height ? height : 10}
      className={`rounded-full cursor-pointer  `}
    ></Avatar>
  );
};
