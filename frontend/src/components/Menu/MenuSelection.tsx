import React from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IoMdArrowDropdown } from "react-icons/io";
import { When } from "react-if";
import { Option } from "../../interfaces";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface IMenuSelection {
  defaultValue: number | string;
  options: Option[];
  setValue: (value: any) => void;
  description?: string;
  menuListClassName?: string;
}
const MenuSelection: React.FC<IMenuSelection> = ({
  defaultValue,
  options,
  description,
  setValue,
  menuListClassName,
}) => {
  return (
    <Menu>
      <When condition={description}>
        <div className="text-base text-white font-bold ">{description}</div>
      </When>
      <MenuButton
        className="text-black w-48 bg-inherit border"
        as={Button}
        w={200}
        bgColor={"white"}
        border={"solid"}
        borderColor={"gray.200"}
        size={"sm"}
        h={8}
        p={1}
        rightIcon={<ChevronDownIcon />}
      >
        <p>{defaultValue}</p>
      </MenuButton>
      <MenuList
        className={
          menuListClassName ? menuListClassName : "bg-white [&>*]:bg-white/90"
        }
      >
        {options.map((option, index) => {
          return (
            <MenuItem
              key={index}
              className={`  text-black hover:bg-gray-200 `}
              onClick={() => setValue(option.value)}
            >
              {option.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default MenuSelection;
