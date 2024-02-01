import { IProject } from "@/interfaces";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useProjectsStore } from "@/store/projectsStore";
import { table } from "console";
import { isDeadlineNear } from "@/utils/utils";

const handleDeleteProject = async (project: IProject) => {
  useProjectsStore.getState().deleteProject(project);
};

const handleViewProject = (project: IProject) => {
  useProjectsStore.getState().setActiveProject(project);
  window.location.href = "/project_overview/";
};

export const columns: ColumnDef<IProject>[] = [
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
    accessorKey: "projectLead",
    header: "Project Lead Name",
    cell: ({ row }) => {
      const project = row.original;

      return project.projectLead.name;
    },
  },
  {
    accessorKey: "projectType",
    header: "Project Type",
  },

  {
    accessorKey: "date_created",
    header: "Date Created",
    cell: ({ row }) => {
      const project = row.original;

      return project?.date_created?.slice(0, 10);
    },
  },
  {
    header: "Deadline",
    cell: ({ row }) => {
      const project = row.original;
      const deadline = project?.deadline?.endDate;
      if (deadline) {
        const isNear = isDeadlineNear(new Date(deadline)) 
        return <p className={` ${isNear && "text-destructive"}`}>{deadline.slice(0, 10)}</p>;
      } else {
        return "No deadline";
      }
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const project = row.original;
      const handleDeleteProject = table.options.meta?.handleDeleteData;
      const handleViewProject = table.options.meta?.handleViewData;
      const handleViewProjectUsers = table.options.meta?.handleViewNestedData;

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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleViewProject && handleViewProject(project)}
            >
              View project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleViewProjectUsers &&
                handleViewProjectUsers(project.users, project?._id!)
              }
            >
              View users
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleDeleteProject && handleDeleteProject(project)
              }
            >
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
