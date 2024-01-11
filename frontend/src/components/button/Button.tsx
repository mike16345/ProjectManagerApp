import React, { FC, ReactNode } from "react";

interface ButtonProps {
  type?: "submit" | "reset";
  onClick?: () => void;
  style?: string;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ type, onClick, style, children }) => {
  const margin = style;
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
