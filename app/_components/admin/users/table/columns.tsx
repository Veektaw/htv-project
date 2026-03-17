import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { User } from "@/types/auth";
import { cn } from "@/lib/utils";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";
import UserStatus from "./columns/status";

type ColumnType = User & { actions?: ReactNode };

export const usersColumns: Column<ColumnType>[] = [
  {
    title: "First Name",
    key: "first_name",
    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>{value}</span>
    ),
  },
  {
    title: "Last Name",
    key: "last_name",
    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>{value}</span>
    ),
  },
  {
    title: "Email",
    key: "email",
    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>{value}</span>
    ),
  },
  {
    title: "Role",
    key: "role",
    render: (value, record) => (
      <span className={cn("capitalize", record.is_deactivated && "opacity-50")}>
        {value}
      </span>
    ),
  },
  {
    title: "Status",
    key: "is_deactivated",
    render: (value) => <UserStatus deactivatedStatus={value as boolean} />,
  },
  {
    title: "",
    key: "actions",
    render: (_, record) => (
      <MenuActions>
        <Actions user={record} />
      </MenuActions>
    ),
  },
];
