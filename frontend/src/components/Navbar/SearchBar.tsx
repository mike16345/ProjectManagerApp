import React, { useState, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";

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
    <div className=" flex-center">
      <div className="relative flex items-center max-w-2xl">
        <SearchIcon
          onClick={search}
          className="absolute right-2 top-1/2 h-4 w-4 cursor-pointer -translate-y-1/2 transform"
        />
        <Input
          type="text"
          placeholder="Search for project..."
          onChange={searchInputHandler}
          value={searchInput}
        />
      </div>
    </div>
  );
};

export default SearchBar;
