import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Payment } from "@/types/doctors-payments";
import { formatDate } from "@/lib/utils";

type ColumnType = Payment & { actions?: ReactNode };

export const PaymentColumns: Column<ColumnType>[] = [
  {
    title: "Date",
    key: "created_at",
    render: (value) => formatDate(value as string),
  },
  {
    title: "Platform",
    key: "platform",
    render: (value) => value as string,
  },
  {
    title: "Amount",
    key: "amount",
    render: (value) => `$${Number(value).toFixed(2)}`,
  },
  {
    title: "Payment Date",
    key: "submitted_at",
    render: (value) => (value ? formatDate(value as string) : "N/A"),
  },
  {
    title: "Source",
    key: "source",
    render: (value) => (value as string) || "N/A",
  },
  {
    title: "Invoice ID",
    key: "invoice_ref",
    render: (value) => value as string,
  },
  {
    title: "Batch ID",
    key: "batch_id",
    render: (value) => value as string,
  },
];
