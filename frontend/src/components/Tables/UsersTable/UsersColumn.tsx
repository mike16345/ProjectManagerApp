import { IProject, IUser } from "@/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { When } from "react-if";
import { Checkbox } from "@/components/ui/checkbox";
import { userRequests } from "@/requests/UserRequests";
import { projectRequests } from "@/requests/ProjectRequests";

const handleMakeUserAdmin = async (user: IUser) => {
  user.isAdmin = true;
  await userRequests.editItemRequest(user);
};

const handleDeleteUser = async (user: IUser) => {
  const userProjects = await projectRequests.getItemsByRequest<IProject>(
    user._id,
    "byUser"
  );

  for (const project of userProjects) {
    project.users = project.users.filter((u) => u._id !== user._id);
  }

  await projectRequests.bulkEditItemsRequest(userProjects);
  await userRequests.deleteItemRequest(user._id);
};

export const columns: ColumnDef<IUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "isAdmin",
    header: "Admin",
  },
  {
    accessorKey: "date_created",
    header: "Date Created",
    cell: ({ row }) => {
      const user = row.original;

      return user.date_created.slice(0, 10);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <When condition={!user.isAdmin}>
              <DropdownMenuItem onClick={() => handleMakeUserAdmin(user)}>
                {!user.isAdmin && "Make Admin"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </When>
            <DropdownMenuItem>View user</DropdownMenuItem>
            <DropdownMenuItem>View projects</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteUser(user)}>
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
