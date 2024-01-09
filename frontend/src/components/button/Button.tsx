import React, { FC, ReactNode } from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  style?: string;
  children: ReactNode;
}

const Button: FC<ButtonProps> = (props) => {
  const margin = props.style;
  return (
    <button
      type={props.type}
      className={` m-4 md:m-6 lg:m-8 xl:m-10 w-48 h-16 bg-dark text-light text-2xl font-oswald font-bold tracking-wider hover:scale-105 rounded-md transition duration-300 ease-in-out`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
