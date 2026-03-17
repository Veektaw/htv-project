"use client";

import { useUsers } from "../contexts/users-provider";
import { usersColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { users } = useUsers();

  return (
    <TableComponent
      title="Users"
      columns={usersColumns}
      data={users}
      // className={isPending ? "animate-pulse" : ""}
    />
  );
}
