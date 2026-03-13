"use client";

import { User } from "@/types/auth";
import { usersColumns } from "./columns";
import TableComponent from "@/app/_components/shared/tableComponent/TableComponent";

type TableWrapperProps = {
  data: User[];
};

export default function TableWrapper({ data }: TableWrapperProps) {
  return (
    <TableComponent
      title="Users"
      columns={usersColumns}
      data={data}
      // className={isPending ? "animate-pulse" : ""}
    />
  );
}
