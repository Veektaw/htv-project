"use client";

import { useInvoices } from "../contexts/invoices-provider";
import TablePagination from "@/app/_components/shared/table-component/table-pagination";

export default function TablePaginationWrapper() {
  const { pagination } = useInvoices();

  return <TablePagination pagination={pagination} />;
}
