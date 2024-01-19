import { FC } from "react";

interface ProfileProps {
  name?: string;
  width?: string;
  height?: string;
  onClick?: (name: string) => void;
}

export const Profile: FC<ProfileProps> = ({ onClick, width, height, name }) => {
  const shortName = name?.substring(0, 2).toUpperCase();
  const handleClick = () => {
    if (onClick) onClick(name || "");
  };
  return (
    <div
      onClick={handleClick}
      className={`rounded-full bg-red-500 ${width ? width : "w-10"} ${
        height ? height : "h-10"
      } cursor-pointer hover:scale-105 font-bold text-center flex justify-center items-center  `}
    >
      {shortName}
    </div>
  );
};
