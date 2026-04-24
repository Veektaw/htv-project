import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { GetAdminPayments } from "@/types/payments";
import { format } from "date-fns";
import DeletePaymentModal from "../modals/delete-payment-modal";
import Status from "./status";
import { InvoiceStatus } from "@/types/invoices";

type ColumnType = GetAdminPayments & { actions?: ReactNode };

export const paymentColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "doctor",
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Log Date",
    key: "created_at",
    render: (_, record) => format(new Date(record.created_at), "dd/MM/yyyy"),
  },
  {
    title: "Platform",
    key: "platform",
    render: (_, record) => record.platform,
  },
  {
    title: "Amount",
    key: "amount",
    render: (_, record) =>
      `${record.amount_paid.toLocaleString("en-US", { style: "currency", currency: "EUR" })}`,
  },
  // {
  //   title: "Invoice Ref",
  //   key: "invoice_ref",
  //   render: (_, record) => record.invoice_ref,
  // },
  {
    title: "Payment Date",
    key: "payment_date",
    render: (_, record) =>
      record.payment_date
        ? format(new Date(record.payment_date), "dd/MM/yyyy")
        : "N/A",
  },
  // {
  //   title: "Payment Status",
  //   key: "status",
  //   render: (_, record) => record.status,
  // },
  {
    title: "Status",
    key: "status",
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
  {
    title: "Payment Method",
    key: "payment_method",
    render: (_, record) => record.payment_type || "N/A",
  },
  {
    title: "Batch ID",
    key: "batch_id",
    render: (_, record) => record.batch_id || "N/A",
  },

  {
    title: "Actions",
    key: "actions",
    render: (_, record) => <DeletePaymentModal paymentId={record.id} />,
  },
];
