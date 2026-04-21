import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { User } from "@/types/auth";
import { cn } from "@/lib/utils";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";
import UserStatus from "./columns/status";

type ColumnType = User & { actions?: ReactNode };

export const userColumns: Column<ColumnType>[] = [
  {
    title: "First Name",
    key: "first_name",
    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>
        {value as string}
      </span>
    ),
  },
  {
    title: "Last Name",
    key: "last_name",
    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>
        {value as string}
      </span>
    ),
  },
  {
    title: "Email",
    key: "email",
    render: (value, record) => (
      <span className={cn(record.is_deactivated && "opacity-50")}>
        {value as string}
      </span>
    ),
  },
  {
    title: "Role",
    key: "role",
    render: (value, record) => (
      <span className={cn("capitalize", record.is_deactivated && "opacity-50")}>
        {value as string}
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
// import { ReactNode, Suspense } from "react";
// import { Column } from "@/app/_components/shared/table-component/table-component";
// import { User } from "@/types/auth";
// import { cn } from "@/lib/utils";
// import MenuActions from "@/app/_components/shared/menu-actions";
// import Actions from "./columns/actions";
// import UserStatus from "./columns/status";
// import SortableHeader from "@/app/_components/shared/header/sortableHeader";

// type ColumnType = User & { actions?: ReactNode };

// export type SortOrder = "asc" | "desc";
// export type SortableUserKey = "first_name" | "last_name" | "email" | "role" | "status";


// export function sortUsers(
//   users: User[],
//   sortKey?: string,
//   sortOrder?: string
// ): User[] {
//   const validKeys: SortableUserKey[] = ["first_name", "last_name", "email", "role","status"];
//   const key = validKeys.find((k) => k === sortKey);

//   if (!key) return users;

//   const order: SortOrder = sortOrder === "desc" ? "desc" : "asc";

//   return [...users].sort((a, b) => {
//     const aVal = (a[key] ?? "").toString().toLowerCase();
//     const bVal = (b[key] ?? "").toString().toLowerCase();

//     if (aVal < bVal) return order === "asc" ? -1 : 1;
//     if (aVal > bVal) return order === "asc" ? 1 : -1;
//     return 0;
//   });
// }


// function Header({ label, sortKey }: { label: string; sortKey: string }) {
//   return (
//     <Suspense fallback={<span className="font-semibold">{label}</span>}>
//       <SortableHeader label={label} sortKey={sortKey} />
//     </Suspense>
//   );
// }

// export const userColumns: Column<ColumnType>[] = [
//   {
//     title: <Header label="First Name" sortKey="first_name" />,
//     key: "first_name",
//     render: (value, record) => (
//       <span className={cn(record.is_deactivated && "opacity-50")}>
//         {value as string}
//       </span>
//     ),
//   },
//   {
//     title: <Header label="Last Name" sortKey="last_name" />,
//     key: "last_name",
//     render: (value, record) => (
//       <span className={cn(record.is_deactivated && "opacity-50")}>
//         {value as string}
//       </span>
//     ),
//   },
//   {
//     title: <Header label="Email" sortKey="email" />,
//     key: "email",
//     render: (value, record) => (
//       <span className={cn(record.is_deactivated && "opacity-50")}>
//         {value as string}
//       </span>
//     ),
//   },
//   {
//     title: <Header label="Role" sortKey="role" />,
//     key: "role",
//     render: (value, record) => (
//       <span className={cn("capitalize", record.is_deactivated && "opacity-50")}>
//         {value as string}
//       </span>
//     ),
//   },
//   {
//     title: "Status",
//     key: "is_deactivated",
//     render: (value) => <UserStatus deactivatedStatus={value as boolean} />,
//   },
//   {
//     title: "",
//     key: "actions",
//     render: (_, record) => (
//       <MenuActions>
//         <Actions user={record} />
//       </MenuActions>
//     ),
//   },
// ];