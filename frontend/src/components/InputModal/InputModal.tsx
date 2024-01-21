import React, { SetStateAction } from "react";
import { Input } from "@chakra-ui/react";

interface InputProps {
  value: string;
  setValue: React.Dispatch<SetStateAction<any>>;
  width: string;
  height: string;
}

const CustomInput: React.FC<InputProps> = () => {
  return <div></div>;
};

export default CustomInput;
