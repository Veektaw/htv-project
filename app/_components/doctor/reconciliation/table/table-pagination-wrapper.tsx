"use client";

import { useReconciliation } from "../contexts/reconciliation-provider";
import TablePagination from "@/app/_components/shared/table-component/table-pagination";

export default function TablePaginationWrapper() {
  const { pagination } = useReconciliation();

  return <TablePagination pagination={pagination} />;
}
