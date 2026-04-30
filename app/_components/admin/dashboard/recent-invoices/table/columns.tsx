import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice, InvoiceStatus } from "@/types/invoices";

import Status from "../../../invoices/table/columns/status";
import SortableHeader from "@/app/_components/shared/header/sortableHeader";

type ColumnType = Invoice & { actions?: ReactNode };

export const invoicesColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    renderTitle: () => <SortableHeader label="Name" sortKey="full_name" />,
    render: (_, record) => record.user.full_name,
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
];
