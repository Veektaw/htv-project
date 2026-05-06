import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import Status from "./columns/status";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";
import { formatDate } from "@/lib/utils";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = Invoice & { actions?: ReactNode };

export const InvoiceColumns: Column<ColumnType>[] = [
  {
    title: "Invoice Ref",
    key: "invoice_ref",
    renderTitle: () => (
      <SortableHeader label="Invoice Ref" sortKey="invoice_ref" />
    ),
    render: (_, record) => record.invoice_ref,
  },
  {
    title: "Date created",
    key: "updated_at",
    renderTitle: () => (
      <SortableHeader label="Date Created" sortKey="updated_at" />
    ),
    render: (value) => formatDate(value as string),
  },
  {
    title: "Invoiced Amount",
    key: "amount",
    renderTitle: () => (
      <SortableHeader label="Invoiced Amount" sortKey="amount" />
    ),
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
  },
  {
    title: "Status",
    key: "status",
    renderTitle: () => <SortableHeader label="Status" sortKey="status" />,
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
  {
    title: "Payment Date",
    key: "payment_date",
    renderTitle: () => (
      <SortableHeader label="Payment Date" sortKey="payment_date" />
    ),
    render: (value) => (value ? formatDate(value as string) : "N/A"),
  },
  {
    title: "",
    key: "actions",
    render: (_, record) => (
      <MenuActions>
        <Actions invoice={record} />
      </MenuActions>
    ),
  },
];
