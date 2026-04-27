import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import {
  formatInvoiceCreatedAtDate,
  formatPrescriptionDate,
} from "@/lib/utils";
import Status from "./columns/status";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = Invoice & { actions?: ReactNode };

export const invoiceColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    renderTitle: () => <SortableHeader label="Name" sortKey="full_name" />,
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Month",
    key: "period_month",
    renderTitle: () => <SortableHeader label="Month" sortKey="period_month" />,
    render: (value) => formatPrescriptionDate(value as string),
  },
  {
    title: "Invoice ID",
    key: "invoice_ref",
    renderTitle: () => (
      <SortableHeader label="Invoice ID" sortKey="invoice_ref" />
    ),
    render: (value) => value as string,
  },
  {
    title: "Amount",
    key: "amount",
    renderTitle: () => <SortableHeader label="Amount" sortKey="amount" />,
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Status",
    key: "status",
    renderTitle: () => <SortableHeader label="Status" sortKey="status" />,
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
  {
    title: "Date Created",
    key: "created_at",
    renderTitle: () => (
      <SortableHeader label="Date Created" sortKey="created_at" />
    ),
    render: (value) => formatInvoiceCreatedAtDate(value as string),
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
