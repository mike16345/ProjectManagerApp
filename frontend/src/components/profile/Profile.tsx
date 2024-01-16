import { FC } from "react";

interface ProfileProps {
  name?: string;
  onClick?: (name: string) => void;
}

const Profile: FC<ProfileProps> = ({ onClick, name }) => {
  const shortName = name?.substring(0, 2).toUpperCase();
  const handleClick = () => {
    if (onClick) onClick(name || "");
  };
  return (
    <div
      onClick={handleClick}
      className="rounded-full bg-red-500 cursor-pointer hover:scale-105 w-10 h-10 font-bold text-center flex justify-center items-center "
    >
      {shortName}
    </div>
  );
};

export default Profile;
