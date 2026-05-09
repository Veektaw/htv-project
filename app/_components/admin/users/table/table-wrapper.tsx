"use client";

import { useUsers } from "../contexts/users-provider";
import { userColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { users } = useUsers();

  return <TableComponent title="Users" columns={userColumns} data={users} />;
}
