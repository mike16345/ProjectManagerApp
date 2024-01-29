import React from "react";
import { IUser } from "../../interfaces";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Profile } from "../Profile/Profile";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
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
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={"h-12 justify-between text-muted-foreground"}
          >
            {defaultValue || "Invite Collaborators"}
            <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search user..." />
            <ScrollArea className=" h-48">
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                {users.map((user, index) => {
                  return (
                    <CommandItem
                      key={index}
                      className=" cursor-pointer"
                      value={JSON.stringify(user)}
                      onSelect={() => onSelect(user)}
                    >
                      <div className="flex items-center justify-center">
                        <Profile className="mr-2" user={user} />
                        <div className="flex flex-col justify-center items-start">
                          <span className="text-sm font-semibold">
                            {user.name}
                          </span>
                          <span className="text-sm opacity-75 text-gray-600">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserSelectMenu;
