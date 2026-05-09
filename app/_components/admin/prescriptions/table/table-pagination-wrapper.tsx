"use client";

import { usePrescriptions } from "@/app/_components/doctor/prescriptions/contexts/prescriptions-provider";
import TablePagination from "@/app/_components/shared/table-component/table-pagination";

export default function TablePaginationWrapper() {
  const { pagination } = usePrescriptions();

  return <TablePagination pagination={pagination} />;
}
