import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IUser } from "../../interfaces";

interface ProfileProps {
  user?: IUser;
  className?: string;
  width?: number;
  height?: number;
  onClick?: (name: string) => void;
}

export const Profile: FC<ProfileProps> = ({
  onClick,
  className,
  width,
  height,
  user,
}) => {
  const handleClick = () => {
    if (onClick) onClick(user?.name || "");
  };

  return (
    <Avatar
      className={` cursor-pointer ${className && className} `}
      onClick={handleClick}
    >
      <AvatarImage src={user?.picture} />
      <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
