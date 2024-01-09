import React, { useState, ChangeEvent, MouseEvent } from "react";
import classes from "./SearchBar.module.css";

interface SearchBarProps {
  onInput: (input: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const searchInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchInput(event.target.value);
  };

  const search = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    props.onInput(searchInput);
  };

  return (
    <div className={classes.container}>
      <div className={classes.searchBar}>
        <input
          className={classes.searchBarInput}
          type="text"
          placeholder="Find a Project"
          onChange={searchInputHandler}
          value={searchInput}
        />
      </div>
      <div className="control">
        <a onClick={search} className={classes.searchBtn}>
          Search
        </a>
      </div>
    </div>
  );
};

export default SearchBar;
