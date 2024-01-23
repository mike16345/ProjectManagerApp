import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React, { useState, ChangeEvent } from "react";

interface SearchBarProps {
  onInput: (input: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const searchInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const search = () => {
    console.log("searching");
    props.onInput(searchInput);
  };

  return (
    <Flex justifyItems={"center"} alignItems={"center"}>
      <InputGroup>
        <InputRightElement>
          <SearchIcon
            onClick={search}
            color="gray.300"
            className="cursor-pointer"
          />
        </InputRightElement>
        <Input
          onChange={searchInputHandler}
          type="text"
          color={"white"}
          placeholder="Find a project"
          borderColor="white"
          borderRadius="md"
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchBar;
