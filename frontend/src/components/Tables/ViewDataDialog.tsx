import React, { Dispatch, SetStateAction, useEffect } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Trash2Icon } from "lucide-react";

interface IViewDataDialog<T> {
  open: boolean;
  currItemId?: string;
  data: T[];
  handleDeleteItem: (item: T, id: string) => Promise<void>;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const ViewDataDialog: React.FC<IViewDataDialog<any>> = ({
  data,
  open,
  currItemId,
  setOpen,
  handleDeleteItem,
}) => {
  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {data.map((item, index) => {
              return (
                <CommandItem
                  className="flex items-center justify-between"
                  key={index}
                >
                  <span className="text-sm font-semibold  hover:underline cursor-pointer">
                    {item.name}
                  </span>
                  <Trash2Icon
                    className="cursor-pointer"
                    onClick={() =>
                      handleDeleteItem(item, currItemId || item._id)
                    }
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ViewDataDialog;
