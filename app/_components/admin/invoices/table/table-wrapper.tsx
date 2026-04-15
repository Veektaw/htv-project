"use client";

import { useInvoices } from "../contexts/invoices-provider";
import { invoiceColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { invoices } = useInvoices();

  return (
    <TableComponent
      title="Invoices"
      columns={invoiceColumns}
      data={invoices}
    />
  );
}
