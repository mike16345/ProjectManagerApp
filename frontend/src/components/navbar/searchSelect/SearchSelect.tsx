import React, { useRef } from "react";
import SelectSearch, { Option, Item } from "react-select-search";

import "./SearchSelect.module.css";

interface Workshop {
  type: "group";
  name: string;
  items: Item[];
}

const SearchSelect: React.FC = () => {
  // const searchInput = useRef<SelectSearch | null>(null);

  const options: Workshop[] = [
    {
      type: "group",
      name: "Atlanta",
      items: [
        { name: "Workshop One", value: "1" },
        { name: "Workshop Two", value: "2" },
      ],
    },
    {
      type: "group",
      name: "Charleston",
      items: [
        { name: "Workshop Three", value: "3" },
        { name: "Workshop Four", value: "4" },
        { name: "Workshop Five", value: "5" },
      ],
    },
    {
      type: "group",
      name: "Inactive",
      items: [{ name: "Inactive Workshop", value: "100" }],
    },
  ];

  const handleChange = (value: string, option: Option) => {
    console.log("Selected value:", value);
    console.log("Selected option:", option);
  };

  const handleFilter = (items: Workshop[]) => (searchValue: string) => {
    if (searchValue.length === 0) {
      return items;
    }
    const updatedItems = items.map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    }));
    return updatedItems;
  };

  return (
    <div className="App">
      <SelectSearch
        ref={(ref) => (searchInput.current = ref)}
        options={options}
        filterOptions={handleFilter}
        value=""
        name="Workshop"
        placeholder="Choose a workshop"
        search
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchSelect;
