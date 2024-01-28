import { FC } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IUser } from "../../interfaces";
import { getImage, getImageNames } from "@/utils/utils";
import { Avatar, AvatarBadge } from "@chakra-ui/react";

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
    // <Avatar className="cursor-pointer" onClick={handleClick}>
    //   <AvatarImage src={user?.picture} />
    //   <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
    // </Avatar>
  );
};
