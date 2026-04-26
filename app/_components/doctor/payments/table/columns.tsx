import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Payment } from "@/types/doctors-payments";
import { formatDate } from "@/lib/utils";
import { PaymentStatus } from "@/types/doctors-payments";
import Status from "./columns/status";

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
    key: "amount_paid",
    render: (value) => `€${Number(value).toFixed(2)}`,
  },
  {
    title: "Payment Date",
    key: "updated_at",
    render: (value) => (value ? formatDate(value as string) : "N/A"),
  },
  {
    title: "Status",
    key: "status",
    render: (value) => <Status value={value as PaymentStatus} />,
  },
  {
    title: "Source",
    key: "source",
    render: (value) => (value as string) || "N/A",
  },
  {
    title: "Invoice ID",
    key: "invoice_id",
    render: (value) => value as string,
  },
  {
    title: "Batch ID",
    key: "batch_id",
    render: (value) => value as string,
  },
];
