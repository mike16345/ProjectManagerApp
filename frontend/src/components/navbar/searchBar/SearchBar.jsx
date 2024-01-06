import { useState } from "react";
import classes from "./SearchBar.module.css";

const SearchBar = (props) => {
  const [searchInput, setSearchInput] = useState("");

  const searchInputHandler = (event) => {
    event.preventDefault();
    setSearchInput(event.target.value);
  };

  const search = (e) => {
    e.preventDefault();
    props.onInput(searchInput);
  };

  return (
    <div className={classes.container}>
      <div className="{classes.searchBar}">
        <input
          className={classes.searchBar}
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
