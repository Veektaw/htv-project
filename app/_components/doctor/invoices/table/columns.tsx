import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import Status from "./columns/status";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";
import { formatDate } from "@/lib/utils";

type ColumnType = Invoice & { actions?: ReactNode };

export const InvoiceColumns: Column<ColumnType>[] = [
  {
    title: "Invoice Ref",
    key: "invoice_ref",
    render: (value) => value as string,
  },
  {
    title: "Date created",
    key: "updated_at",
    render: (value) => formatDate(value as string),
  },
  {
    title: "Invoiced Amount",
    key: "amount",
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
  },
  {
    title: "Status",
    key: "status",
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
  {
    title: "Payment Date",
    key: "created_at",
    render: (value) => formatDate(value as string),
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
