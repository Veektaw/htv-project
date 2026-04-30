import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { User } from "@/types/auth";
import { cn } from "@/lib/utils";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";
import UserStatus from "./columns/status";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = User & { actions?: ReactNode };

export const userColumns: Column<ColumnType>[] = [
  {
    title: "First Name",
    key: "first_name",
    renderTitle: () => (
      <SortableHeader label="First Name" sortKey="first_name" />
    ),
    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>
        {value as string}
      </span>
    ),
  },
  {
    title: "Last Name",
    key: "last_name",
    renderTitle: () => <SortableHeader label="Last Name" sortKey="last_name" />,
    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>
        {value as string}
      </span>
    ),
  },
  {
    title: "Email",
    key: "email",
    renderTitle: () => <SortableHeader label="Email" sortKey="email" />,

    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>
        {value as string}
      </span>
    ),
  },
  {
    title: "Role",
    key: "role",
    renderTitle: () => <SortableHeader label="Role" sortKey="role" />,
    render: (value, record) => (
      <span className={cn("capitalize", record.is_deactivated && "opacity-50")}>
        {value as string}
      </span>
    ),
  },
  {
    title: "Status",
    key: "is_deactivated",
    renderTitle: () => (
      <SortableHeader label="Status" sortKey="is_deactivated" />
    ),
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
