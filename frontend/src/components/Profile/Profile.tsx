import { FC } from "react";
import { IUser } from "../../interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileProps {
  user?: IUser;
  className?: string;
  onClick?: (name: string) => void;
}

export const Profile: FC<ProfileProps> = ({ onClick, className, user }) => {
  const handleClick = () => {
    if (onClick) onClick(user?.name || "");
  };

  return (
    user && (
      <Avatar
        className={` cursor-pointer ${className && className} `}
        onClick={handleClick}
      >
        <AvatarImage src={user.picture} />
        <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    )
  );
};
