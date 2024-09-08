import React, { SetStateAction } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";

interface IViewDataDialog<T> {
  open: boolean;
  data: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const ViewDataDialog: React.FC<IViewDataDialog<any>> = ({
  data,
  open,
  renderItem,
  setOpen,
}) => {
  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {data.map((item, index) => renderItem(item, index))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ViewDataDialog;
