"use client";

import { usePayments } from "../contexts/payments-provider";
import TablePagination from "@/app/_components/shared/table-component/table-pagination";

export default function TablePaginationWrapper() {
  const { pagination } = usePayments();

  return <TablePagination pagination={pagination} />;
}
