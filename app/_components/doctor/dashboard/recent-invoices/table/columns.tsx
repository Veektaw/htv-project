import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import { formatInvoiceCreatedAtDate } from "@/lib/utils";
import Status from "../../../invoices/table/columns/status";

type ColumnType = Invoice & { actions?: ReactNode };

export const invoicesColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Invoice ID",
    key: "invoice_ref",
    render: (value) => value as string,
  },
  {
    title: "Date Created",
    key: "created_at",
    render: (value) => formatInvoiceCreatedAtDate(value as string),
  },
  {
    title: "Status",
    key: "status",
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
];
