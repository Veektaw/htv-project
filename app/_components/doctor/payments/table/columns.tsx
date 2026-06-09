import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Payment } from "@/types/doctors-payments";
import { formatDate, formatPaymentDate } from "@/lib/utils";
import { PaymentStatus } from "@/types/doctors-payments";
import Status from "./columns/status";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = Payment & { actions?: ReactNode };

export const PaymentColumns: Column<ColumnType>[] = [
  {
    title: "Date",
    key: "created_at",
    renderTitle: () => <SortableHeader label="Date" sort_by="created_at" />,
    render: (value) => formatDate(value as string),
  },
  {
    title: "Platform",
    key: "platform",
    renderTitle: () => <SortableHeader label="Partner" sort_by="platform" />,
    render: (value) => value as string,
  },
  {
    title: "Amount",
    key: "amount_paid",
    renderTitle: () => <SortableHeader label="Amount" sort_by="amount_paid" />,
    render: (value) => `€${Number(value).toFixed(2)}`,
  },
  {
    title: "Payment Date",
    key: "payment_date",
    renderTitle: () => (
      <SortableHeader label="Payment Date" sort_by="payment_date" />
    ),
    render: (value) => (value ? formatPaymentDate(value as string) : "N/A"),
  },
  {
    title: "Status",
    key: "status",
    renderTitle: () => <SortableHeader label="Status" sort_by="status" />,
    render: (value) => <Status value={value as PaymentStatus} />,
  },
  {
    title: "Source",
    key: "source",
    renderTitle: () => <SortableHeader label="Source" sort_by="source" />,
    render: (value) => (value as string) || "N/A",
  },
  {
    title: "Invoice ID",
    key: "invoice_id",
    renderTitle: () => (
      <SortableHeader label="Invoice ID" sort_by="invoice_id" />
    ),
    render: (value) => value as string,
  },
  {
    title: "Batch ID",
    key: "batch_id",
    renderTitle: () => <SortableHeader label="Batch ID" sort_by="batch_id" />,
    render: (value) => value as string,
  },
];
