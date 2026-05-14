import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import { formatInvoiceCreatedAtDate } from "@/lib/utils";
import Status from "../../../invoices/table/columns/status";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = Invoice & { actions?: ReactNode };

export const invoicesColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    renderTitle: () => <SortableHeader label="Name" sort_by="full_name" />,
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Invoice ID",
    key: "invoice_ref",
    renderTitle: () => (
      <SortableHeader label="Invoice ID" sort_by="invoice_ref" />
    ),
    render: (value) => value as string,
  },
  {
    title: "Date Created",
    key: "created_at",
    renderTitle: () => (
      <SortableHeader label="Date Created" sort_by="created_at" />
    ),
    render: (value) => formatInvoiceCreatedAtDate(value as string),
  },
  {
    title: "Status",
    key: "status",
    renderTitle: () => <SortableHeader label="Status" sort_by="status" />,
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
];
