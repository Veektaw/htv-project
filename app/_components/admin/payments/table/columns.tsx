import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { GetAdminPayments } from "@/types/payments";
import { format } from "date-fns";
import DeletePaymentModal from "../modals/delete-payment-modal";

type ColumnType = GetAdminPayments & { actions?: ReactNode };

export const paymentColumns: Column<ColumnType>[] = [
  {
    title: "Doctor",
    key: "doctor",
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Platform",
    key: "platform",
    render: (_, record) => record.platform,
  },
  {
    title: "Period Month",
    key: "period_month",
    render: (_, record) => record.period_month,
  },
  {
    title: "Prescription Count",
    key: "prescription_count",
    render: (_, record) => record.prescription_count,
  },
  {
    title: "Rate per Prescription",
    key: "rate_per_prescription",
    render: (_, record) => `₦${record.rate_per_prescription}`,
  },
  {
    title: "Gross Amount",
    key: "gross_amount",
    render: (_, record) => `₦${record.gross_amount}`,
  },
  {
    title: "Batch ID",
    key: "batch_id",
    render: (_, record) => record.batch_id,
  },
  {
    title: "Created At",
    key: "created_at",
    render: (_, record) => format(new Date(record.created_at), "dd/MM/yyyy"),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => <DeletePaymentModal paymentId={record.id} />,
  },
];
