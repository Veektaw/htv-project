import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { GetAdminPayments } from "@/types/payments";
import { format } from "date-fns";
import DeletePaymentModal from "../modals/delete-payment-modal";
import Status from "./status";
import { InvoiceStatus } from "@/types/invoices";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = GetAdminPayments & { actions?: ReactNode };

export const paymentColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    renderTitle: () => <SortableHeader label="Name" sort_by="full_name" />,
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Log Date",
    key: "created_at",
    renderTitle: () => <SortableHeader label="Log Date" sort_by="created_at" />,
    render: (_, record) => format(new Date(record.created_at), "dd/MM/yyyy"),
  },
  {
    title: "Partner",
    key: "platform",
    renderTitle: () => <SortableHeader label="Partner" sort_by="platform" />,
    render: (_, record) => record.platform,
  },
  {
    title: "Amount",
    key: "amount",
    renderTitle: () => <SortableHeader label="Amount" sort_by="amount" />,
    render: (_, record) =>
      `${record.amount_paid.toLocaleString("en-US", { style: "currency", currency: "EUR" })}`,
  },

  {
    title: "Payment Date",
    key: "payment_date",
    renderTitle: () => (
      <SortableHeader label="Payment Date" sort_by="payment_date" />
    ),
    render: (_, record) =>
      record.payment_date
        ? format(new Date(record.payment_date), "dd/MM/yyyy")
        : "N/A",
  },

  {
    title: "Status",
    key: "status",
    renderTitle: () => <SortableHeader label="Status" sort_by="status" />,
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
  {
    title: "Payment Method",
    key: "payment_method",
    renderTitle: () => (
      <SortableHeader label="Payment Method" sort_by="payment_method" />
    ),
    render: (_, record) => record.payment_type || "N/A",
  },
  {
    title: "Batch ID",
    key: "batch_id",
    renderTitle: () => <SortableHeader label="Batch ID" sort_by="batch_id" />,
    render: (_, record) => record.batch_id || "N/A",
  },

  {
    title: "Actions",
    key: "actions",
    render: (_, record) => <DeletePaymentModal paymentId={record.id} />,
  },
];
