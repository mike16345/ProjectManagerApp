import React from "react";
import { IUser, Option } from "../../interfaces";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface IUserSelectMenu {
  users: IUser[];
  defaultValue?: string;
  onSelect: (value: any) => void;
}

const UserSelectMenu: React.FC<IUserSelectMenu> = ({
  users,
  defaultValue,
  onSelect,
}) => {
  return (
    <Menu>
      <MenuButton
        className="text-black w-48 bg-inherit border"
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        {defaultValue ? defaultValue : "Add User"}
      </MenuButton>
      <MenuList>
        {users.map((user, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() => onSelect(user)}
              name={user.name}
              minH="48px"
            >
              <Avatar
                boxSize="2rem"
                borderRadius="full"
                src={user.picture}
                mr="12px"
              />
              <VStack alignItems={"start"} gap={0} justifyContent={"center"}>
                <Text className="text-sm font-semibold">{user.name}</Text>
                <span className="text-sm opacity-75 text-gray-600">
                  {user.email}
                </span>
              </VStack>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default UserSelectMenu;
