import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice } from "@/types/invoices";
import { format } from "date-fns";

type ColumnType = Invoice & { actions?: ReactNode };

export const invoiceColumns: Column<ColumnType>[] = [
  {
    title: "Doctor",
    key: "doctor",
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Invoice Reference",
    key: "invoice_ref",
    render: (_, record) => record.invoice_ref,
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
    title: "Amount",
    key: "amount",
    render: (_, record) => `₦${record.amount}`,
  },
  {
    title: "Status",
    key: "status",
    render: (_, record) => (
      <span className={`capitalize ${
        record.status === 'approved' ? 'text-green-600' :
        record.status === 'rejected' ? 'text-red-600' :
        record.status === 'under_review' ? 'text-yellow-600' :
        'text-gray-600'
      }`}>
        {record.status.replace('_', ' ')}
      </span>
    ),
  },
  {
    title: "Submitted At",
    key: "submitted_at",
    render: (_, record) => record.submitted_at ? format(new Date(record.submitted_at), "dd/MM/yyyy") : "N/A",
  },
  {
    title: "Created At",
    key: "created_at",
    render: (_, record) => format(new Date(record.created_at), "dd/MM/yyyy"),
  },
];
