"use client";

import { useReconciliations } from "@/app/_components/doctor/reconciliations/contexts/reconciliations-provider";
import TablePagination from "@/app/_components/shared/table-component/table-pagination";

export default function TablePaginationWrapper() {
  const { pagination } = useReconciliations();

  return <TablePagination pagination={pagination} />;
}
