import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/tableComponent/TableComponent";
import { User } from "@/types/auth";
import { EllipsisVertical } from "lucide-react";

type ColumnType = User & { actions?: ReactNode };

export const usersColumns: Column<ColumnType>[] = [
  {
    title: "First Name",
    key: "first_name",
    render: (value) => value,
  },
  {
    title: "Last Name",
    key: "last_name",
    render: (value) => value,
  },
  {
    title: "Email",
    key: "email",
    render: (value) => value,
  },
  {
    title: "Role",
    key: "role",
    render: (value) => <span className="capitalize">{value}</span>,
  },
  {
    title: "",
    key: "actions",
    render: () => (
      <button>
        <EllipsisVertical className="text-CloudyGrey h-4 w-6" />
      </button>
    ),
  },
];
