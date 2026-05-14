"use client";

import { useUsers } from "../contexts/users-provider";
import TablePagination from "@/app/_components/shared/table-component/table-pagination";

export default function TablePaginationWrapper() {
  const { pagination } = useUsers();

  return <TablePagination pagination={pagination} />;
}
