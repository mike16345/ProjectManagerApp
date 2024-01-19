import { FC, ReactNode } from "react";

interface ButtonProps {
  type?: "submit" | "reset";
  onClick?: () => void;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ type, onClick, children }) => {
  return (
    <button
      type={type || "button"}
      className={` m-4 md:m-6 lg:m-8 xl:m-10 w-48 h-16 bg-dark text-light text-2xl font-oswald font-bold tracking-wider hover:scale-105 rounded-md transition duration-300 ease-in-out`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
